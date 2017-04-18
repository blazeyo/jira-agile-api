# Jira agile api client

Javascript wrapper around jira agile REST api.

## Installation

`npm install jira-agile-api-client`

## Usage

```javascript
var api = require('jira-agile-api-client');
api.setEndpoint('https://myjira.com');

api.board.getList().then(function (boards) { 
  console.log(boards); 
}).catch(function (error) {
  console.log(error);
});
```

See `src/index.js` for a list of available methods.

## Node.js

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

api.util.getSprintHistory(boardId, sprintId).then(function (stats) {
  console.log(stats);
}).catch(function (error) {
  console.log(error);s
});
```

## Web apps

### Online

```javascript
var api = require('jira-agile-api-client');
api.setEndpoint('https://myjira.com');

api.board.getSprints(boardId).then(function (boards) {
  console.log(boards);
}).catch(function (error) {
  console.log(error);
});
```

* CORS needs to be set up.

### Local

Start with `npm run dev-server` and provide jira url, your username and password. Use `http://localhost:3001` as endpoint.
