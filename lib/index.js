'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.util = exports.sprint = exports.issue = exports.board = exports.backlog = exports.sendDeleteRequest = exports.sendRequestWithPayload = exports.sendGetRequest = exports.setEndpoint = exports.setSetting = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _getSprintHistory = require('./util/getSprintHistory');

var _getSprintHistory2 = _interopRequireDefault(_getSprintHistory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var endpointUrl = 'http://localhost:3001';
var api = 'rest/agile/1.0';

var defaultSettings = {
  mode: 'cors',
  cache: 'default'
};

var setSetting = exports.setSetting = function setSetting(key, value) {
  return defaultSettings[key] = value;
};

var esc = encodeURIComponent;

var encodeGetQuery = function encodeGetQuery(params) {
  return Object.keys(params).map(function (k) {
    return esc(k) + '=' + esc(params[k]);
  }).join('&');
};

var url = function url(uri, query) {
  return endpointUrl + '/' + api + '/' + uri + '?' + encodeGetQuery(query);
};

var sendRequest = function sendRequest(uri, settings) {
  var query = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return fetch(url(uri, query), _extends({}, defaultSettings, settings)).then(function (response) {
    return response.json();
  });
};

var setEndpoint = exports.setEndpoint = function setEndpoint(url) {
  return endpointUrl = url;
};

var sendGetRequest = exports.sendGetRequest = function sendGetRequest(resourceUri) {
  var query = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return sendRequest(resourceUri, { method: 'GET' }, query);
};

var sendRequestWithPayload = exports.sendRequestWithPayload = function sendRequestWithPayload(resourceUri, payload) {
  var httpMethod = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'POST';
  var query = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  return sendRequest(resourceUri, { method: httpMethod, body: JSON.stringify(payload) }, query);
};

var sendDeleteRequest = exports.sendDeleteRequest = function sendDeleteRequest(resourceUri) {
  return sendRequest(resourceUri, { method: 'DELETE' });
};

var backlog = exports.backlog = {};

/**
 * @param string[] issues
 *   Array of issue ids, eg ['PR-1'].
 */
backlog.moveIssuesToBacklog = function (issues) {
  return sendRequestWithPayload('backlog/issue', { issues: issues });
};

var board = exports.board = {};

board.getList = function (params) {
  return sendGetRequest('board', params);
};

board.getSingle = function (boardId, params) {
  return sendGetRequest('board/' + boardId, params);
};

board.getIssues = function (boardId, params) {
  return sendGetRequest('board/' + boardId + '/issues', params);
};

board.getBacklog = function (boardId, params) {
  return sendGetRequest('board/' + boardId + '/backlog', params);
};

board.getConfiguration = function (boardId, params) {
  return sendGetRequest('board/' + boardId + '/configuration', params);
};

board.getSprints = function (boardId, params) {
  return sendGetRequest('board/' + boardId + '/sprint', params);
};

board.getSprintIssues = function (boardId, sprintId, params) {
  return sendGetRequest('board/' + boardId + '/sprint/' + sprintId + '/issue', params);
};

board.create = function (name, type, filterId) {
  var otherValues = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  return sendRequestWithPayload('board', _extends({
    name: name,
    type: type,
    filterId: filterId
  }, otherValues));
};

board.delete = function (boardId) {
  return sendDeleteRequest('board/' + boardId);
};

var issue = exports.issue = {};

issue.getSingle = function (issueIdOrKey, params) {
  return sendGetRequest('issue/' + issueIdOrKey, params);
};

issue.getEstimation = function (issueIdOrKey, params) {
  return sendGetRequest('issue/' + issueIdOrKey + '/estimation', params);
};

issue.setEstimation = function (issueIdOrKey, boardId, value) {
  return sendRequestWithPayload('issue/' + issueIdOrKey + '/estimation', { value: value }, 'PUT', { boardId: boardId });
};

var sprint = exports.sprint = {};

sprint.create = function (name, boardId, otherValues) {
  return sendRequestWithPayload('sprint', _extends({
    name: name,
    originBoardId: boardId
  }, otherValues));
};

sprint.update = function (sprintId, newValue) {
  return sendRequestWithPayload('sprint/' + sprintId, newValue, 'PUT');
};

sprint.partialUpdate = function (sprintId, fieldsToUpdate) {
  return sendRequestWithPayload('sprint/' + sprintId, fieldsToUpdate);
};

sprint.delete = function (sprintId) {
  return sendDeleteRequest('sprint/' + sprintId);
};

sprint.getSingle = function (sprintId, params) {
  return sendGetRequest('sprint/' + sprintId, params);
};

sprint.moveIssuesToSprint = function (sprintId, issues) {
  return sendRequestWithPayload('sprint/' + sprintId + '/issue', { issues: issues });
};

sprint.getIssues = function (sprintId, params) {
  return sendGetRequest('sprint/' + sprintId + '/issue', params);
};

sprint.swapWith = function (sprintId, secondSprintId) {
  return sendRequestWithPayload('sprint/' + sprintId + '/issue', { sprintToSwapWith: secondSprintId });
};

sprint.getPropertiesKeys = function (sprintId, params) {
  return sendGetRequest('sprint/' + sprintId + '/properties', params);
};

sprint.deleteProperty = function (sprintId, propertyKey) {
  return sendDeleteRequest('sprint/' + sprintId + '/properties/' + propertyKey);
};

sprint.setProperty = function (sprintId, value) {
  return sendRequestWithPayload('sprint/' + sprintId + '/properties/' + propertyKey, { value: value }, 'PUT');
};

sprint.getProperty = function (sprintId, propertyKey, params) {
  return sendGetRequest('sprint/' + sprintId + '/properties/' + propertyKey, params);
};

var util = exports.util = {
  getSprintHistory: _getSprintHistory2.default
};
//# sourceMappingURL=index.js.map