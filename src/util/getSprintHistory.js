/*
 * foreach issues as issue
 *   estimation = getEstimation(issue)
 *   foreach days as day
 *     status = computeStatusOn(issue, day)
 *     stats[day][status] += estimation
 */

import {
  board as boardEndpoint,
  sprint as sprintEndpoint,
  issue as issueEndpoint
} from '../index';

const debug = false;

const initialStatus = 'To Do';

/**
 * Print message when in debug mode.
 *
 * @param message
 */
const log = message => {
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
const getValue = (issue, field) => issue.fields[field];

/**
 * Normalizes date objects by settings their time to 23:59:59.
 *
 * @param {Date | String} date
 * @returns {Date}
 */
const getNormalizedDate = (date) => {
  const normalized = new Date(date || Date.now());
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
const getStatusOn = (issue, day, sprint) => {
  const { fields: { created },  changelog: { histories } } = issue;
  // Start with current status and iterate over history
  // in reverse order until passing the given day.
  let status = initialStatus;

  // TODO Monitor the sprint that the issue is associated with
  //      and return null if it wasn't in that sprint at given day.

  // If the issue had been created after the given day return null.
  if (getNormalizedDate(created) > day) {
    log(`- N/A (issue created on ${created})`)
    return null;
  }

  for (let h in histories) {
    const change = histories[h];
    const date = getNormalizedDate(change.created);

    for (let i in change.items) {
      const item = change.items[i];
      if (item.field === 'status') {
        status = item.toString;
      }
    }

    if (date === day) {
      break;
    }
  }

  log(`- ${status}`);

  return status;
};

/**
 * Formats date as yyyy-mm-dd.
 *
 * @param {Date} date
 * @returns {String}
 */
const formatDate = date => [date.getFullYear(), date.getMonth(), date.getDate()]
  .map(item => item.toString())
  .join('-');

/**
 * Builds historical statistics from given set of issues.
 *
 * @param {Array<Object>} issues
 * @param {Object} sprint
 * @param {String} estimationField
 * @returns {{}}
 */
const getSprintHistoryFromIssues = (issues, sprint, estimationField) => {
  const stats = {};

  const today = getNormalizedDate();
  const sprintStartDate = getNormalizedDate(sprint.startDate);
  sprintStartDate.setDate(sprintStartDate.getDate() - 1);

  log(`Found ${issues.length} issues. Fetching history since ${sprintStartDate}.`);

  // TODO Move the code to a separate module in jira-agile-api.

  issues.map(issue => {
    let dateString, status;
    const estimation = getValue(issue, estimationField);
    const day = new Date(today);

    log(`Processing issue ${issue.key}. Estimation: ${estimation}.`);

    while (day >= sprintStartDate) {
      log(`Status on ${day}:`);

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
      day.setDate(day.getDate() - 1)
    }
  });

  // Turn the object into an array for easier iteration.
  const result = [];
  for (let key in stats) {
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
const getAllIssues = (boardId, sprintId) => {
  return new Promise((resolve, reject) => {
    let results = [];
    let finished = null;

    (function getPage() {
      if (!finished) new Promise(resolvePage => {
        log('Calling issues endpoint');
        boardEndpoint.getSprintIssues(boardId, sprintId, { expand: 'changelog', startAt: results.length }).then(page => {
          const { total, issues } = page;

          results = results.concat(issues);
          log(`Received ${issues.length} issues. ${results.length} total.`);

          if (results.length === total) {
            finished = true;
            resolve(results);
          }

          resolvePage();
        })
      }).catch(error =>
        reject(error)
      ).then(
        getPage.bind(null)
      );
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
const getSprintHistory = (boardId, sprintId) => {
  return new Promise((resolve, reject) => {
    let sprint, issues;

    sprintEndpoint.getSingle(sprintId).then(response => {
      sprint = response;
      return getAllIssues(boardId, sprintId);
    }).then(response => {
      issues = response;
      return issueEndpoint.getEstimation(issues[0].key, { boardId: boardId });
    }).then(({ fieldId }) => {
      resolve(getSprintHistoryFromIssues(issues, sprint, fieldId));
    }).catch(error => reject(error));
  });
};

export default getSprintHistory;
