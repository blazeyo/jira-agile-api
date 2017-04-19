import getSprintHistory from './util/getSprintHistory';

let endpointUrl = 'http://localhost:3001';
const prefix = 'rest/agile/1.0';

const defaultSettings = {
  mode: 'cors',
  cache: 'default',
};

const esc = encodeURIComponent;

const encodeGetQuery = params =>
  Object.keys(params)
    .map(k => `${esc(k)}=${esc(params[k])}`)
    .join('&');

const url = (uri, query) =>
  `${endpointUrl}/${prefix}/${uri}?${encodeGetQuery(query)}`;

const sendRequest = (uri, settings, query = {}) =>
  fetch(url(uri, query), { ...defaultSettings, ...settings })
    .then(response => response.json());

const api = {};

api.setSetting = (key, value) =>
  defaultSettings[key] = value;

api.setEndpoint = (url) =>
  endpointUrl = url;

api.sendGetRequest = (resourceUri, query = {}) =>
  sendRequest(resourceUri, { method: 'GET' }, query);

api.sendRequestWithPayload = (resourceUri, payload, httpMethod = 'POST', query = {}) =>
  sendRequest(resourceUri, { method: httpMethod, body: JSON.stringify(payload) }, query);

api.sendDeleteRequest = (resourceUri) =>
  sendRequest(resourceUri, { method: 'DELETE' });

api.backlog = {};

/**
 * @param string[] issues
 *   Array of issue ids, eg ['PR-1'].
 */
api.backlog.moveIssuesToBacklog = issues =>
  sendRequestWithPayload('backlog/issue', {issues: issues})

api.board = {};

api.board.getList = (params) =>
  sendGetRequest('board', params);

api.board.getSingle = (boardId, params) =>
  sendGetRequest(`board/${boardId}`, params);

api.board.getIssues = (boardId, params) =>
  sendGetRequest(`board/${boardId}/issues`, params);

api.board.getBacklog = (boardId, params) =>
  sendGetRequest(`board/${boardId}/backlog`, params);

api.board.getConfiguration = (boardId, params) =>
  sendGetRequest(`board/${boardId}/configuration`, params);

api.board.getSprints = (boardId, params) =>
  sendGetRequest(`board/${boardId}/sprint`, params);

api.board.getSprintIssues = (boardId, sprintId, params) =>
  sendGetRequest(`board/${boardId}/sprint/${sprintId}/issue`, params);

api.board.create = (name, type, filterId, otherValues = {}) =>
  sendRequestWithPayload('board', {
    name,
    type,
    filterId,
    ... otherValues
  });

api.board.delete = (boardId) =>
  sendDeleteRequest(`board/${boardId}`);

api.issue = {};

api.issue.getSingle = (issueIdOrKey, params) =>
  sendGetRequest(`issue/${issueIdOrKey}`, params);

api.issue.getEstimation = (issueIdOrKey, params) =>
  sendGetRequest(`issue/${issueIdOrKey}/estimation`, params);

api.issue.setEstimation = (issueIdOrKey, boardId, value) =>
  sendRequestWithPayload(
    `issue/${issueIdOrKey}/estimation`,
    { value },
    'PUT',
    { boardId }
  );

api.sprint = {};

api.sprint.create = (name, boardId, otherValues) =>
  sendRequestWithPayload(`sprint`, {
    name,
    originBoardId: boardId,
    ... otherValues
  });

api.sprint.update = (sprintId, newValue) =>
  sendRequestWithPayload(`sprint/${sprintId}`, newValue, 'PUT');

api.sprint.partialUpdate = (sprintId, fieldsToUpdate) =>
  sendRequestWithPayload(`sprint/${sprintId}`, fieldsToUpdate);

api.sprint.delete = (sprintId) =>
  sendDeleteRequest(`sprint/${sprintId}`);

api.sprint.getSingle = (sprintId, params) =>
  sendGetRequest(`sprint/${sprintId}`, params);

api.sprint.moveIssuesToSprint = (sprintId, issues) =>
  sendRequestWithPayload(`sprint/${sprintId}/issue`, { issues });

api.sprint.getIssues = (sprintId, params) =>
  sendGetRequest(`sprint/${sprintId}/issue`, params);

api.sprint.swapWith = (sprintId, secondSprintId) =>
  sendRequestWithPayload(`sprint/${sprintId}/issue`, { sprintToSwapWith: secondSprintId });

api.sprint.getPropertiesKeys = (sprintId, params) =>
  sendGetRequest(`sprint/${sprintId}/properties`, params);

api.sprint.deleteProperty = (sprintId, propertyKey) =>
  sendDeleteRequest(`sprint/${sprintId}/properties/${propertyKey}`);

api.sprint.setProperty = (sprintId, value) =>
  sendRequestWithPayload(`sprint/${sprintId}/properties/${propertyKey}`, { value }, 'PUT');

api.sprint.getProperty = (sprintId, propertyKey, params) =>
  sendGetRequest(`sprint/${sprintId}/properties/${propertyKey}`, params);

api.util = {
  getSprintHistory
};

export default api;

export const setSetting = api.setSetting;
export const setEndpoint = api.setEndpoint;
export const sendGetRequest = api.sendGetRequest;
export const sendRequestWithPayload = api.sendRequestWithPayload;
export const sendDeleteRequest = api.sendDeleteRequest;

export const board = api.board;
export const backlog = api.backlog;
export const issue = api.issue;
export const sprint = api.sprint;
export const util = api.util;
