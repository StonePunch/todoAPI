'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _todoController = require('../controllers/todoController');

var _todoController2 = _interopRequireDefault(_todoController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

var BASEROUTE = '/api/v1/todos';

/*
  GET
  List all the todos
*/
router.get(BASEROUTE, _todoController2.default.getAllTodos);

/*
  POST
  Creating a todo
*/
router.post(BASEROUTE, _todoController2.default.createTodo);

/*
  GET
  Get a single todo
*/
router.get(BASEROUTE + '/:id', _todoController2.default.getTodo);

/*
  DELETE
  Delete a todo
*/
router.delete(BASEROUTE + '/:id', _todoController2.default.deleteTodo);

/*
  PUT
  Replaces a todo with a new one
*/
router.put(BASEROUTE + '/:id', _todoController2.default.replaceTodo);

/*
  Patch
  Updates a todo with new information
*/
router.patch(BASEROUTE + '/:id', _todoController2.default.updateTodo);

exports.default = router;
//# sourceMappingURL=router.js.map