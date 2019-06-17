import path from 'path'
import logger from '../helper/logger'
import controllerSelector from '../routing/controllerSelector'

const basePath = path.join(
  __dirname,
  `/../controllers/`
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

const GetConsistantController = controller => {
  if (controller) {
    if (!controller.default) {
      return controller
    }
    return controller.default
  } else {
    return null
  }
}

class BaseController {
  async get (req, res) {
    const controller = GetConsistantController(await GetController(req)
      .catch(err => { throw err })
      .then(val => { return val }))

    if (controller) {
      controller.getTodo(req, res)
    } else {
      return res.status(404).send({
        success: false,
        message: 'Requested endpoint not found, make sure the version is correct'
      })
    }
  }

  async post (req, res) {
    const controller = GetConsistantController(await GetController(req)
      .catch(err => { throw err })
      .then(val => { return val }))

    if (controller) {
      controller.postTodo(req, res)
    } else {
      return res.status(404).send({
        success: false,
        message: 'Requested endpoint not found, make sure the version is correct'
      })
    }
  }

  async patch (req, res) {
    const controller = GetConsistantController(await GetController(req)
      .catch(err => { throw err })
      .then(val => { return val }))

    if (controller) {
      controller.patchTodo(req, res)
    } else {
      return res.status(404).send({
        success: false,
        message: 'Requested endpoint not found, make sure the version is correct'
      })
    }
  }

  async put (req, res) {
    const controller = GetConsistantController(await GetController(req)
      .catch(err => { throw err })
      .then(val => { return val }))

    if (controller) {
      controller.putTodo(req, res)
    } else {
      return res.status(404).send({
        success: false,
        message: 'Requested endpoint not found, make sure the version is correct'
      })
    }
  }

  async delete (req, res) {
    const controller = GetConsistantController(await GetController(req)
      .catch(err => { throw err })
      .then(val => { return val }))

    if (controller) {
      controller.deleteTodo(req, res)
    } else {
      return res.status(404).send({
        success: false,
        message: 'Requested endpoint not found, make sure the version is correct'
      })
    }
  }
}

const baseController = new BaseController()
module.exports = baseController
