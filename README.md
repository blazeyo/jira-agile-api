# Jira agile api client

Javascript wrapper around jira agile REST api.

## Installation

`npm install jira-agile-api-client`

## Usage

```
var api = require('jira-agile-api-client');
api.setEndpoint('https://myjira.com');
api.board.getList().then(function (boards) { console.log(boards); });
```

See `src/index.js` for a list of available methods.

## Local development

Start with `npm run dev-server` and provide jira url, your username and password. Use `http://localhost:3001` as endpoint.
