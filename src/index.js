let endpointUrl = 'http://localhost:3001';
const api = 'rest/agile/1.0';

const fetchSettings = {
  method: 'GET',
  mode: 'cors',
  cache: 'default',
};

const esc = encodeURIComponent;

export const makeRequest = (method, params = {}) => {
  const query = Object.keys(params)
    .map(k => `${esc(k)}=${esc(params[k])}`)
    .join('&');

  return fetch(`${endpointUrl}/${api}/${method}?${query}`, fetchSettings)
    .then(response => response.json());
};

export const setEndpoint = (url) =>
  endpointUrl = url;

export const board = {
  getList: (params) =>
    makeRequest('board', params),
  getSingle: (boardId, params) =>
    makeRequest(`board/${boardId}`, params),
  getIssues: (boardId, params) =>
    makeRequest(`board/${boardId}/issues`, params),
  getBacklog: (boardId, params) =>
    makeRequest(`board/${boardId}/backlog`, params),
  getConfiguration: (boardId, params) =>
    makeRequest(`board/${boardId}/configuration`, params),
  getSprints: (boardId, params) =>
    makeRequest(`board/${boardId}/sprint`, params),
  getSprintIssues: (boardId, sprintId, params) =>
    makeRequest(`board/${boardId}/sprint/${sprintId}/issue`, params),
};

export const issue = {
  getSingle: (issueIdOrKey, params) =>
    makeRequest(`issue/${issueIdOrKey}`, params),
  getEstimation: (issueIdOrKey, params) =>
    makeRequest(`issue/${issueIdOrKey}/estimation`, params),
};

export const sprint = {
  getSingle: (sprintId, params) =>
    makeRequest(`sprint/${sprintId}`, params),
  getIssues: (sprintId, params) =>
    makeRequest(`sprint/${sprintId}/issue`, params),
  getPropertiesKeys: (sprintId, params) =>
    makeRequest(`sprint/${sprintId}/properties`, params),
  getProperty: (sprintId, property, params) =>
    makeRequest(`sprint/${sprintId}/properties/${property}`, params),
};
