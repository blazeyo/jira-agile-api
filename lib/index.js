'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _getSprintHistory = require('./util/getSprintHistory');

var _getSprintHistory2 = _interopRequireDefault(_getSprintHistory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var endpointUrl = 'http://localhost:3001';
var prefix = 'rest/agile/1.0';

var defaultSettings = {
  mode: 'cors',
  cache: 'default'
};

var esc = encodeURIComponent;

var encodeGetQuery = function encodeGetQuery(params) {
  return Object.keys(params).map(function (k) {
    return esc(k) + '=' + esc(params[k]);
  }).join('&');
};

var url = function url(uri, query) {
  return endpointUrl + '/' + prefix + '/' + uri + '?' + encodeGetQuery(query);
};

var sendRequest = function sendRequest(uri, settings) {
  var query = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return fetch(url(uri, query), _extends({}, defaultSettings, settings)).then(function (response) {
    return response.json();
  });
};

var api = {};

api.setSetting = function (key, value) {
  return defaultSettings[key] = value;
};

api.setEndpoint = function (url) {
  return endpointUrl = url;
};

api.sendGetRequest = function (resourceUri) {
  var query = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return sendRequest(resourceUri, { method: 'GET' }, query);
};

api.sendRequestWithPayload = function (resourceUri, payload) {
  var httpMethod = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'POST';
  var query = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  return sendRequest(resourceUri, { method: httpMethod, body: JSON.stringify(payload) }, query);
};

api.sendDeleteRequest = function (resourceUri) {
  return sendRequest(resourceUri, { method: 'DELETE' });
};

api.backlog = {};

/**
 * @param string[] issues
 *   Array of issue ids, eg ['PR-1'].
 */
api.backlog.moveIssuesToBacklog = function (issues) {
  return sendRequestWithPayload('backlog/issue', { issues: issues });
};

api.board = {};

api.board.getList = function (params) {
  return sendGetRequest('board', params);
};

api.board.getSingle = function (boardId, params) {
  return sendGetRequest('board/' + boardId, params);
};

api.board.getIssues = function (boardId, params) {
  return sendGetRequest('board/' + boardId + '/issues', params);
};

api.board.getBacklog = function (boardId, params) {
  return sendGetRequest('board/' + boardId + '/backlog', params);
};

api.board.getConfiguration = function (boardId, params) {
  return sendGetRequest('board/' + boardId + '/configuration', params);
};

api.board.getSprints = function (boardId, params) {
  return sendGetRequest('board/' + boardId + '/sprint', params);
};

api.board.getSprintIssues = function (boardId, sprintId, params) {
  return sendGetRequest('board/' + boardId + '/sprint/' + sprintId + '/issue', params);
};

api.board.create = function (name, type, filterId) {
  var otherValues = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  return sendRequestWithPayload('board', _extends({
    name: name,
    type: type,
    filterId: filterId
  }, otherValues));
};

api.board.delete = function (boardId) {
  return sendDeleteRequest('board/' + boardId);
};

api.issue = {};

api.issue.getSingle = function (issueIdOrKey, params) {
  return sendGetRequest('issue/' + issueIdOrKey, params);
};

api.issue.getEstimation = function (issueIdOrKey, params) {
  return sendGetRequest('issue/' + issueIdOrKey + '/estimation', params);
};

api.issue.setEstimation = function (issueIdOrKey, boardId, value) {
  return sendRequestWithPayload('issue/' + issueIdOrKey + '/estimation', { value: value }, 'PUT', { boardId: boardId });
};

api.sprint = {};

api.sprint.create = function (name, boardId, otherValues) {
  return sendRequestWithPayload('sprint', _extends({
    name: name,
    originBoardId: boardId
  }, otherValues));
};

api.sprint.update = function (sprintId, newValue) {
  return sendRequestWithPayload('sprint/' + sprintId, newValue, 'PUT');
};

api.sprint.partialUpdate = function (sprintId, fieldsToUpdate) {
  return sendRequestWithPayload('sprint/' + sprintId, fieldsToUpdate);
};

api.sprint.delete = function (sprintId) {
  return sendDeleteRequest('sprint/' + sprintId);
};

api.sprint.getSingle = function (sprintId, params) {
  return sendGetRequest('sprint/' + sprintId, params);
};

api.sprint.moveIssuesToSprint = function (sprintId, issues) {
  return sendRequestWithPayload('sprint/' + sprintId + '/issue', { issues: issues });
};

api.sprint.getIssues = function (sprintId, params) {
  return sendGetRequest('sprint/' + sprintId + '/issue', params);
};

api.sprint.swapWith = function (sprintId, secondSprintId) {
  return sendRequestWithPayload('sprint/' + sprintId + '/issue', { sprintToSwapWith: secondSprintId });
};

api.sprint.getPropertiesKeys = function (sprintId, params) {
  return sendGetRequest('sprint/' + sprintId + '/properties', params);
};

api.sprint.deleteProperty = function (sprintId, propertyKey) {
  return sendDeleteRequest('sprint/' + sprintId + '/properties/' + propertyKey);
};

api.sprint.setProperty = function (sprintId, value) {
  return sendRequestWithPayload('sprint/' + sprintId + '/properties/' + propertyKey, { value: value }, 'PUT');
};

api.sprint.getProperty = function (sprintId, propertyKey, params) {
  return sendGetRequest('sprint/' + sprintId + '/properties/' + propertyKey, params);
};

api.util = {
  getSprintHistory: _getSprintHistory2.default
};

exports.default = api;
//# sourceMappingURL=index.js.map