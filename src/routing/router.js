import express from 'express'
import todoController from '../controllers/todoController'
import versionController from './versioning'

const router = express.Router()

const BASEROUTE = '/api/todos'

let version
router.use((req, _res, next) => {
  const acceptHeader = versionController.getVersion(req)

  version = acceptHeader.match(/version=([0-9]+\.[0-9])*/)
  if (version == null) {
    next()
  }

  version = version[1]

  next()
})

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
