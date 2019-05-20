'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _todoModel = require('../models/todoModel');

var _todoModel2 = _interopRequireDefault(_todoModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ModelFactory = function () {
  function ModelFactory() {
    _classCallCheck(this, ModelFactory);
  }

  _createClass(ModelFactory, [{
    key: 'CreateTodoModel',
    value: function CreateTodoModel(_ref) {
      var id = _ref.id,
          title = _ref.title,
          description = _ref.description;

      return new _todoModel2.default(id, title, description);
    }
  }]);

  return ModelFactory;
}();

var modelFactory = new ModelFactory();
exports.default = modelFactory;
//# sourceMappingURL=modelFactory.js.map