import express from 'express'
import logger from '../helper/logger'
import todoController from '../controllers/todoController/todoControllerV1.0'
import controllerSelector from './controllerSelector'

const router = express.Router()

const BASEROUTE = '/api/todo'

// let todoController
router.use(async (req, res, next) => {
  const controller = await controllerSelector.GetController(req)
    .catch(err => { throw err })
    .then(val => { return val.data })

  if (controller) {
    const controllerSegments = controller.split('\\')
    const controllerName = controllerSegments[0]
    const controllerVersion = controllerSegments[1].split('V')[1]

    logger.consoleLog(`Selected ${controllerName}, version ${controllerVersion} to handle the request`)

    // todoController = require(`../controllers/${controller}`)

    next()
  } else {
    return res.status(404).send({
      success: false,
      message: 'Requested endpoint not found, make sure the version is correct'
    })
  }
})

/*
  GET
  List all the todos
*/
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
