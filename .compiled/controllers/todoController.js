'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _todoRepo = require('../data/todoRepo');

var _modelFactory = require('../models/modelFactory');

var _modelFactory2 = _interopRequireDefault(_modelFactory);

var _modelParser = require('../entities/modelParser');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TodosController = function () {
  function TodosController() {
    _classCallCheck(this, TodosController);
  }

  _createClass(TodosController, [{
    key: 'getAllTodos',
    value: async function getAllTodos(req, res) {
      (0, _todoRepo.GetAll)().then(function (val) {
        if (val.success) {
          return res.status(200).send({
            success: true,
            message: 'Todos were retrieved successfully',
            data: val.data.map(function (todo) {
              return _modelFactory2.default.CreateTodoModel(todo);
            })
          });
        }
        return res.status(404).send({
          success: false,
          message: 'No Todos were found'
        });
      });
    }
  }, {
    key: 'getTodo',
    value: async function getTodo(req, res) {
      (0, _todoRepo.GetById)(req.params.id).then(function (val) {
        if (val.success) {
          return res.status(200).send({
            success: true,
            message: 'Todo was retrieved successfully',
            data: _modelFactory2.default.CreateTodoModel(val.data)
          });
        }
        return res.status(404).send({
          success: false,
          message: 'Todo does not exist'
        });
      });
    }
  }, {
    key: 'createTodo',
    value: async function createTodo(req, res) {
      if (!req.body.title) {
        return res.status(400).send({
          success: false,
          message: 'Title is required'
        });
      }

      if (!req.body.description) {
        return res.status(400).send({
          success: false,
          message: 'Description is required'
        });
      }

      var returnData = await _modelParser.modelParser.ParseTodoModel(_modelParser.ActionEnum.POST, {
        'id': req.params.id,
        'title': req.body.title,
        'description': req.body.description
      }).then(function (val) {
        return val;
      });

      if (!returnData.success) {
        return res.status(400).send({
          success: false,
          message: 'Provided information is incorrect'
        });
      }

      (0, _todoRepo.CreateTodo)(returnData.data).then(function (val) {
        if (val.success) {
          return res.status(201).send({
            success: true,
            message: 'Todo created successfully',
            data: _modelFactory2.default.CreateTodoModel(val.data)
          });
        }
        return res.status(400).send({
          success: false,
          message: 'Failed to create a new Todo'
        });
      });
    }
  }, {
    key: 'updateTodo',
    value: async function updateTodo(req, res) {
      var returnData = await _modelParser.modelParser.ParseTodoModel(_modelParser.ActionEnum.PATCH, {
        id: req.params.id,
        title: req.body.title,
        description: req.body.description
      }).then(function (val) {
        return val;
      });

      if (!returnData.success) {
        return res.status(400).send({
          success: false,
          message: 'Provided information is incorrect'
        });
      }

      (0, _todoRepo.UpdateTodo)(returnData.data).then(function (val) {
        if (val.success) {
          return res.status(204).send({
            success: true,
            message: 'Todo updated successfully'
          });
        }
        return res.status(400).send({
          success: false,
          message: 'Failed to update the Todo'
        });
      });
    }
  }, {
    key: 'replaceTodo',
    value: async function replaceTodo(req, res) {
      var returnData = await _modelParser.modelParser.ParseTodoModel(_modelParser.ActionEnum.PUT, {
        'id': req.params.id,
        'title': req.body.title,
        'description': req.body.description
      }).then(function (val) {
        return val;
      });

      if (!returnData.success) {
        return res.status(400).send({
          success: false,
          message: 'Provided information is incorrect'
        });
      }

      (0, _todoRepo.UpdateTodo)(returnData.data).then(function (val) {
        if (val.success) {
          return res.status(204).send({
            success: true,
            message: 'Todo updated successfully'
          });
        }
        return res.status(400).send({
          success: false,
          message: 'Failed to update the Todo'
        });
      });
    }
  }, {
    key: 'deleteTodo',
    value: async function deleteTodo(req, res) {
      (0, _todoRepo.DeleteTodo)(req.params.id).then(function (val) {
        if (val.success) {
          return res.status(204).send({
            success: true,
            message: 'Todo was deleted successfully'
          });
        }
        return res.status(404).send({
          success: false,
          message: 'Todo not found'
        });
      });
    }
  }]);

  return TodosController;
}();

var todoController = new TodosController();
exports.default = todoController;
//# sourceMappingURL=todoController.js.map