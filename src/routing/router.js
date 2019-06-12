import express from 'express'
// import logger from '../helper/logger'
import todoController from '../controllers/todoController/baseTodoController'
// import controllerSelector from './controllerSelector'

const router = express.Router()

const BASEROUTE = '/api/todo'

router.get(BASEROUTE, todoController.getTodo)

/*
  POST
  Creating a todo
*/
router.post(BASEROUTE, todoController.postTodo)

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
router.put(`${BASEROUTE}/:id`, todoController.putTodo)

/*
  PATCH
  Updates a todo with new information
*/
router.patch(`${BASEROUTE}/:id`, todoController.patchTodo)

export default router
