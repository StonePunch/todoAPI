import express from 'express'
import todoController from '../controllers/todoController'

const router = express.Router()

const BASEROUTE = '/api/v1/todos'

/*
  GET
  List all the todos
*/
router.get(BASEROUTE, todoController.getAllTodos)

/*
  POST
  Creating a todo
*/
router.post(BASEROUTE, todoController.createTodo)

/*
  GET
  Get a single todo
*/
router.get(`${BASEROUTE}/:id`, todoController.getTodo)

/*
  DELETE
  Delete a todo
*/
router.delete(`${BASEROUTE}/:id`, todoController.deleteTodo)

/*
  PUT
  Replaces a todo with a new one
*/
router.put(`${BASEROUTE}/:id`, todoController.replaceTodo)

/*
  Patch
  Updates a todo with new information
*/
router.patch(`${BASEROUTE}/:id`, todoController.updateTodo)

export default router
