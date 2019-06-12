import path from 'path'
import logger from '../../helper/logger'
import controllerSelector from '../../routing/controllerSelector'

const basePath = path.join(
  __dirname,
  `/../../controllers/`
)

const GetController = async (req) => {
  const controller = await controllerSelector.GetSelectedController(req)
    .catch(err => { throw err })
    .then(val => { return val.data })

  if (controller) {
    const controllerSegments = controller.split('\\')
    const controllerName = controllerSegments[0]
    const controllerVersion = controllerSegments[1].split('V')[1]

    logger.consoleLog(`Selected ${controllerName}, version ${controllerVersion} to handle the request`)

    return require(path.join(basePath, controller))
  }
  return null
}

class TodosController {
  async getTodo (req, res) {
    const todoController = await GetController(req)
      .catch(err => { throw err })
      .then(val => { return val })

    if (todoController) {
      todoController.getTodo(req, res)
    } else {
      return res.status(404).send({
        success: false,
        message: 'Requested endpoint not found, make sure the version is correct'
      })
    }
  }

  async postTodo (req, res) {
    const todoController = await GetController(req)
      .catch(err => { throw err })
      .then(val => { return val })

    if (todoController) {
      todoController.postTodo(req, res)
    } else {
      return res.status(404).send({
        success: false,
        message: 'Requested endpoint not found, make sure the version is correct'
      })
    }
  }

  async patchTodo (req, res) {
    const todoController = await GetController(req)
      .catch(err => { throw err })
      .then(val => { return val })

    if (todoController) {
      todoController.patchTodo(req, res)
    } else {
      return res.status(404).send({
        success: false,
        message: 'Requested endpoint not found, make sure the version is correct'
      })
    }
  }

  async putTodo (req, res) {
    const todoController = await GetController(req)
      .catch(err => { throw err })
      .then(val => { return val })

    if (todoController) {
      todoController.putTodo(req, res)
    } else {
      return res.status(404).send({
        success: false,
        message: 'Requested endpoint not found, make sure the version is correct'
      })
    }
  }

  async deleteTodo (req, res) {
    const todoController = await GetController(req)
      .catch(err => { throw err })
      .then(val => { return val })

    if (todoController) {
      todoController.deleteTodo(req, res)
    } else {
      return res.status(404).send({
        success: false,
        message: 'Requested endpoint not found, make sure the version is correct'
      })
    }
  }
}

const todoController = new TodosController()
module.exports = todoController
