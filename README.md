# Jira agile api client
Javascript wrapper around jira agile REST api.

## Installation
`npm install jira-agile-api-client`

## Setup

### Node.js
```javascript
var api = require('jira-agile-api-client');
var btoa = require('btoa');

// Import fetch polyfill.
global.fetch = require('node-fetch');

// Set JIRA Url.
api.setEndpoint('https://jira.example.com');

// Set login data.
api.setSetting('headers', {
  'Authorization': 'Basic '+btoa('USERNAME:PASSWORD')
});
```

### Browser apps - online
The app either needs to be in the same domain or CORS should be set up.
```javascript
var api = require('jira-agile-api-client');
api.setEndpoint('https://jira.example.com');
```

### Browser apps - local
Start with `npm run dev-server` and provide jira url, your username and password. Use `http://localhost:3001` as endpoint.
```javascript
var api = require('jira-agile-api-client');
api.setEndpoint('http://localhost:3001');
```

## Usage

### Get day-by-day sprint statistics.
```javascript
api.util.getSprintWithHistory(boardId, sprintId).then(function (result) {
  console.log(result.history);

  // result.history
  // [{
  //   "date": "2017-01-01",
  //   "stats": {
  //     "To Do": 10.5,
  //     "Done": 5,
  //     ...
  //   }
  // }, {
  //   "date": "2017-01-02",
  //   "stats": {
  //     "To Do": 9,
  //     "Done": 6,
  //     ...
  // }]

  console.log(result.sprint);
  console.log(result.issues);
}).catch(function (error) {
  console.log(error);
});
```

### Get all boards
```javascript
api.board.getList().then(function (boards) {
  console.log(boards);
}).catch(function (error) {
  console.log(error);
});
```

### Get all sprints in a board
```javascript
api.board.getSprints(boardId).then(function (boards) {
  console.log(boards);
}).catch(function (error) {
  console.log(error);
});
```

### Create a new sprint
```javascript
api.sprint.create(name, boardId).then(function (sprint) {
  console.log(sprint);
}).catch(function (error) {
  console.log(error);
});
```

### Move issues to a sprint
```javascript
api.sprint.moveIssuesToSprint(sprintId, ['TEST-1', 'TEST-2']).then(function (result) {
  console.log(result);
}).catch(function (error) {
  console.log(error);
});
```

See `src/index.js` for a full list of available methods.
