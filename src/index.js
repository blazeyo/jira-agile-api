import getSprintHistory from './util/getSprintHistory';

let endpointUrl = 'http://localhost:3001';
const api = 'rest/agile/1.0';

const defaultSettings = {
  mode: 'cors',
  cache: 'default',
};

export const setSetting = (key, value) =>
  defaultSettings[key] = value;

const esc = encodeURIComponent;

const encodeGetQuery = params =>
  Object.keys(params)
    .map(k => `${esc(k)}=${esc(params[k])}`)
    .join('&');

const url = (uri, query) =>
  `${endpointUrl}/${api}/${uri}?${encodeGetQuery(query)}`;

const sendRequest = (uri, settings, query = {}) =>
  fetch(url(uri, query), { ...defaultSettings, ...settings })
    .then(response => response.json());

export const setEndpoint = (url) =>
  endpointUrl = url;

export const sendGetRequest = (resourceUri, query = {}) =>
  sendRequest(resourceUri, { method: 'GET' }, query);

export const sendRequestWithPayload = (resourceUri, payload, httpMethod = 'POST', query = {}) =>
  sendRequest(resourceUri, { method: httpMethod, body: JSON.stringify(payload) }, query);

export const sendDeleteRequest = (resourceUri) =>
  sendRequest(resourceUri, { method: 'DELETE' });

export const backlog = {};

/**
 * @param string[] issues
 *   Array of issue ids, eg ['PR-1'].
 */
backlog.moveIssuesToBacklog = issues =>
  sendRequestWithPayload('backlog/issue', {issues: issues})

export const board = {};

board.getList = (params) =>
  sendGetRequest('board', params);

board.getSingle = (boardId, params) =>
  sendGetRequest(`board/${boardId}`, params);

board.getIssues = (boardId, params) =>
  sendGetRequest(`board/${boardId}/issues`, params);

board.getBacklog = (boardId, params) =>
  sendGetRequest(`board/${boardId}/backlog`, params);

board.getConfiguration = (boardId, params) =>
  sendGetRequest(`board/${boardId}/configuration`, params);

board.getSprints = (boardId, params) =>
  sendGetRequest(`board/${boardId}/sprint`, params);

board.getSprintIssues = (boardId, sprintId, params) =>
  sendGetRequest(`board/${boardId}/sprint/${sprintId}/issue`, params);

board.create = (name, type, filterId, otherValues = {}) =>
  sendRequestWithPayload('board', {
    name,
    type,
    filterId,
    ... otherValues
  });

board.delete = (boardId) =>
  sendDeleteRequest(`board/${boardId}`);

export const issue = {};

issue.getSingle = (issueIdOrKey, params) =>
  sendGetRequest(`issue/${issueIdOrKey}`, params);

issue.getEstimation = (issueIdOrKey, params) =>
  sendGetRequest(`issue/${issueIdOrKey}/estimation`, params);

issue.setEstimation = (issueIdOrKey, boardId, value) =>
  sendRequestWithPayload(
    `issue/${issueIdOrKey}/estimation`,
    { value },
    'PUT',
    { boardId }
  );

export const sprint = {};

sprint.create = (name, boardId, otherValues) =>
  sendRequestWithPayload(`sprint`, {
    name,
    originBoardId: boardId,
    ... otherValues
  });

sprint.update = (sprintId, newValue) =>
  sendRequestWithPayload(`sprint/${sprintId}`, newValue, 'PUT');

sprint.partialUpdate = (sprintId, fieldsToUpdate) =>
  sendRequestWithPayload(`sprint/${sprintId}`, fieldsToUpdate);

sprint.delete = (sprintId) =>
  sendDeleteRequest(`sprint/${sprintId}`);

sprint.getSingle = (sprintId, params) =>
  sendGetRequest(`sprint/${sprintId}`, params);

sprint.moveIssuesToSprint = (sprintId, issues) =>
  sendRequestWithPayload(`sprint/${sprintId}/issue`, { issues });

sprint.getIssues = (sprintId, params) =>
  sendGetRequest(`sprint/${sprintId}/issue`, params);

sprint.swapWith = (sprintId, secondSprintId) =>
  sendRequestWithPayload(`sprint/${sprintId}/issue`, { sprintToSwapWith: secondSprintId });

sprint.getPropertiesKeys = (sprintId, params) =>
  sendGetRequest(`sprint/${sprintId}/properties`, params);

sprint.deleteProperty = (sprintId, propertyKey) =>
  sendDeleteRequest(`sprint/${sprintId}/properties/${propertyKey}`);

sprint.setProperty = (sprintId, value) =>
  sendRequestWithPayload(`sprint/${sprintId}/properties/${propertyKey}`, { value }, 'PUT');

sprint.getProperty = (sprintId, propertyKey, params) =>
  sendGetRequest(`sprint/${sprintId}/properties/${propertyKey}`, params);

export const util = {
  getSprintHistory
};
