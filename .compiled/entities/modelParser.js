'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.modelParser = exports.ActionEnum = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _todoRepo = require('../data/todoRepo');

var _logger = require('../helper/logger');

var _logger2 = _interopRequireDefault(_logger);

var _todo = require('../entities/todo');

var _todo2 = _interopRequireDefault(_todo);

var _returnData = require('../dataTypes/returnData');

var _returnData2 = _interopRequireDefault(_returnData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ParseForCreate = async function ParseForCreate(title, description) {
  // All fields, besides the id, must be present for the creation of a Todo
  if (!title) return new _returnData2.default(false);
  if (!description) return new _returnData2.default(false);

  return new _returnData2.default(true, new _todo2.default(null, title, description));
};

var ParseForReplace = async function ParseForReplace(id, title, description) {
  if (!id) return new _returnData2.default(false);

  try {
    var todo = void 0;
    await (0, _todoRepo.GetById)(id).catch(function (err) {
      throw err;
    }).then(function (val) {
      todo = val.data;
    });

    // Check if the Todo exists
    if (!todo) return new _returnData2.default(false);

    // All fields must be present in order to do a PUT operation
    if (!title) return new _returnData2.default(false);
    if (!description) return new _returnData2.default(false);

    return new _returnData2.default(true, new _todo2.default(id, title, description));
  } catch (err) {
    _logger2.default.consoleLog('Error occured while parsing a model for a replace operation', err);
    return new _returnData2.default(false, null, err);
  }
};

var ParseForUpdate = async function ParseForUpdate(id, title, description) {
  if (!id) return new _returnData2.default(false);

  try {
    var todo = void 0;
    await (0, _todoRepo.GetById)(id).catch(function (err) {
      throw err;
    }).then(function (val) {
      todo = val.data;
    });

    // Check if the Todo exists
    if (!todo) return new _returnData2.default(false);

    /*
    // If nothing entered in the title or
    // description fields, maintain previous value
    */
    title = title || todo.title;
    description = description || todo.description;

    return new _returnData2.default(true, new _todo2.default(id, title, description));
  } catch (err) {
    _logger2.default.consoleLog('Error occured while parsing a model for a update operation', err);
    return new _returnData2.default(false, null, err);
  }
};

var ActionEnum = exports.ActionEnum = {
  'GET': 1,
  'POST': 2,
  'PUT': 3,
  'PATCH': 4,
  'DELETE': 5
};

var ModelParser = function () {
  function ModelParser() {
    _classCallCheck(this, ModelParser);
  }

  _createClass(ModelParser, [{
    key: 'ParseTodoModel',
    value: function ParseTodoModel(action, _ref) {
      var id = _ref.id,
          title = _ref.title,
          description = _ref.description;

      switch (action) {
        case 2:
          return ParseForCreate(title, description);

        case 3:
          return ParseForReplace(id, title, description);

        case 4:
          return ParseForUpdate(id, title, description);

        default:
          return null;
      }
    }
  }]);

  return ModelParser;
}();

var modelParser = exports.modelParser = new ModelParser();
//# sourceMappingURL=modelParser.js.map