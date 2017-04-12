'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var endpointUrl = 'http://localhost:3001';
var api = 'rest/agile/1.0';

var fetchSettings = {
  method: 'GET',
  mode: 'cors',
  cache: 'default'
};

var esc = encodeURIComponent;

var makeRequest = exports.makeRequest = function makeRequest(method) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var query = Object.keys(params).map(function (k) {
    return esc(k) + '=' + esc(params[k]);
  }).join('&');

  return fetch(endpointUrl + '/' + api + '/' + method + '?' + query, fetchSettings).then(function (response) {
    return response.json();
  });
};

var setEndpoint = exports.setEndpoint = function setEndpoint(url) {
  return endpointUrl = url;
};

var board = exports.board = {
  getList: function getList(params) {
    return makeRequest('board', params);
  },
  getSingle: function getSingle(boardId, params) {
    return makeRequest('board/' + boardId, params);
  },
  getIssues: function getIssues(boardId, params) {
    return makeRequest('board/' + boardId + '/issues', params);
  },
  getBacklog: function getBacklog(boardId, params) {
    return makeRequest('board/' + boardId + '/backlog', params);
  },
  getConfiguration: function getConfiguration(boardId, params) {
    return makeRequest('board/' + boardId + '/configuration', params);
  },
  getSprints: function getSprints(boardId, params) {
    return makeRequest('board/' + boardId + '/sprint', params);
  },
  getSprintIssues: function getSprintIssues(boardId, sprintId, params) {
    return makeRequest('board/' + boardId + '/sprint/' + sprintId + '/issue', params);
  }
};

var issue = exports.issue = {
  getSingle: function getSingle(issueIdOrKey, params) {
    return makeRequest('issue/' + issueIdOrKey, params);
  },
  getEstimation: function getEstimation(issueIdOrKey, params) {
    return makeRequest('issue/' + issueIdOrKey + '/estimation', params);
  }
};

var sprint = exports.sprint = {
  getSingle: function getSingle(sprintId, params) {
    return makeRequest('sprint/' + sprintId, params);
  },
  getIssues: function getIssues(sprintId, params) {
    return makeRequest('sprint/' + sprintId + '/issue', params);
  },
  getPropertiesKeys: function getPropertiesKeys(sprintId, params) {
    return makeRequest('sprint/' + sprintId + '/properties', params);
  },
  getProperty: function getProperty(sprintId, property, params) {
    return makeRequest('sprint/' + sprintId + '/properties/' + property, params);
  }
};
//# sourceMappingURL=index.js.map