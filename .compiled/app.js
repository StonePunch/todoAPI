'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _router = require('./routes/router');

var _router2 = _interopRequireDefault(_router);

var _Logger = require('./helper/Logger');

var _Logger2 = _interopRequireDefault(_Logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Set up the express app
var app = (0, _express2.default)();

// Parse incoming requests
app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: false }));

// Log Request
app.use(function (req, res, next) {
  if (req) {
    _Logger2.default.consoleLog('Request to server for: ' + req.url);
  }
  next();
});

// Assign the router
app.use(_router2.default);

var PORT = 5000;

app.listen(PORT, function () {
  _Logger2.default.consoleLog('Server is running on port http://localhost:' + PORT);
});
//# sourceMappingURL=app.js.map