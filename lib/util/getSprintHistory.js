'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('../index');

var debug = false; /*
                    * foreach issues as issue
                    *   estimation = getEstimation(issue)
                    *   foreach days as day
                    *     status = computeStatusOn(issue, day)
                    *     stats[day][status] += estimation
                    */

var initialStatus = 'To Do';

/**
 * Print message when in debug mode.
 *
 * @param message
 */
var log = function log(message) {
  if (debug) {
    console.log(message);
  }
};

/**
 * Returns value of given field in given issue.
 *
 * @param {object} issue
 * @param {string} field
 */
var getValue = function getValue(issue, field) {
  return issue.fields[field];
};

/**
 * Normalizes date objects by settings their time to 23:59:59.
 *
 * @param {Date | String} date
 * @returns {Date}
 */
var getNormalizedDate = function getNormalizedDate(date) {
  var normalized = new Date(date || Date.now());
  normalized.setHours(23);
  normalized.setMinutes(59);
  normalized.setSeconds(59);
  return normalized;
};

/**
 * Returns the status that the issue was in at the end of the given day.
 *
 * @param {Object} issue
 * @param {Date} day
 * @param {Object} sprint
 * @returns {String}
 */
var getStatusOn = function getStatusOn(issue, day, sprint) {
  var created = issue.fields.created,
      histories = issue.changelog.histories;
  // Start with current status and iterate over history
  // in reverse order until passing the given day.

  var status = initialStatus;

  // TODO Monitor the sprint that the issue is associated with
  //      and return null if it wasn't in that sprint at given day.

  // If the issue had been created after the given day return null.
  if (getNormalizedDate(created) > day) {
    log('- N/A (issue created on ' + created + ')');
    return null;
  }

  for (var h in histories) {
    var change = histories[h];
    var date = getNormalizedDate(change.created);

    for (var i in change.items) {
      var item = change.items[i];
      if (item.field === 'status') {
        status = item.toString;
      }
    }

    if (date === day) {
      break;
    }
  }

  log('- ' + status);

  return status;
};

/**
 * Formats date as yyyy-mm-dd.
 *
 * @param {Date} date
 * @returns {String}
 */
var formatDate = function formatDate(date) {
  return [date.getFullYear(), date.getMonth(), date.getDate()].map(function (item) {
    return item.toString();
  }).join('-');
};

/**
 * Builds historical statistics from given set of issues.
 *
 * @param {Array<Object>} issues
 * @param {Object} sprint
 * @param {String} estimationField
 * @returns {{}}
 */
var getSprintHistoryFromIssues = function getSprintHistoryFromIssues(issues, sprint, estimationField) {
  var stats = {};

  var today = getNormalizedDate();
  var sprintStartDate = getNormalizedDate(sprint.startDate);
  sprintStartDate.setDate(sprintStartDate.getDate() - 1);

  log('Found ' + issues.length + ' issues. Fetching history since ' + sprintStartDate + '.');

  // TODO Move the code to a separate module in jira-agile-api.

  issues.map(function (issue) {
    var dateString = void 0,
        status = void 0;
    var estimation = getValue(issue, estimationField);
    var day = new Date(today);

    log('Processing issue ' + issue.key + '. Estimation: ' + estimation + '.');

    while (day >= sprintStartDate) {
      log('Status on ' + day + ':');

      // Lack of status means that the issue didn't exist yet
      // at given day or was not in the sprint at that point.
      if (status = getStatusOn(issue, day, sprint)) {
        // Get date in yyyy-mm-dd format.
        dateString = formatDate(day);

        // Make sure date and status stats are initialized.
        stats[dateString] = stats[dateString] || {};
        stats[dateString][status] = stats[dateString][status] || 0;

        stats[dateString][status] += estimation;
      }

      // Go one day back.
      day.setDate(day.getDate() - 1);
    }
  });

  // Turn the object into an array for easier iteration.
  var result = [];
  for (var key in stats) {
    if (stats.hasOwnProperty(key)) {
      result.push({
        date: key,
        stats: stats[key]
      });
    }
  }

  return result;
};

/**
 * Returns a promise to fetch all the issues in given sprint.
 *
 * @param {String} boardId
 * @param {String} sprintId
 * @returns {Promise}
 */
var getAllIssues = function getAllIssues(boardId, sprintId) {
  return new Promise(function (resolve, reject) {
    var results = [];
    var finished = null;

    (function getPage() {
      if (!finished) new Promise(function (resolvePage) {
        log('Calling issues endpoint');
        _index.board.getSprintIssues(boardId, sprintId, { expand: 'changelog', startAt: results.length }).then(function (page) {
          var total = page.total,
              issues = page.issues;


          results = results.concat(issues);
          log('Received ' + issues.length + ' issues. ' + results.length + ' total.');

          if (results.length === total) {
            finished = true;
            resolve(results);
          }

          resolvePage();
        });
      }).catch(function (error) {
        return reject(error);
      }).then(getPage.bind(null));
    })();
  });
};

/**
 * Returns a promise to fetch historical statistics for given sprint.
 *
 * @param {String} boardId
 * @param {String} sprintId
 * @returns {Promise}
 */
var getSprintHistory = function getSprintHistory(boardId, sprintId) {
  return new Promise(function (resolve, reject) {
    var sprint = void 0,
        issues = void 0;

    _index.sprint.getSingle(sprintId).then(function (response) {
      sprint = response;
      return getAllIssues(boardId, sprintId);
    }).then(function (response) {
      issues = response;
      return _index.issue.getEstimation(issues[0].key, { boardId: boardId });
    }).then(function (_ref) {
      var fieldId = _ref.fieldId;

      resolve(getSprintHistoryFromIssues(issues, sprint, fieldId));
    }).catch(function (error) {
      return reject(error);
    });
  });
};

exports.default = getSprintHistory;
//# sourceMappingURL=getSprintHistory.js.map