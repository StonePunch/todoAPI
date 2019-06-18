import path from 'path'
import logger from '../helper/logger'
import controllerSelector from '../routing/controllerSelector'

const GetController = async req => {
  const basePath = path.join(
    __dirname,
    `/../controllers/`
  )

  const controller = await controllerSelector.GetController(req)
    .catch(err => { throw err })
    .then(val => { return val.data })

  if (controller) {
    const controllerSegments = controller.split('\\')
    const controllerName = controllerSegments[0]
    const controllerVersion = controllerSegments[1].split('V')[1]

    logger.consoleLog(`Selected ${controllerName}, version ${controllerVersion} to handle the request`)

    return GetConsistantController(require(path.join(basePath, controller)))
  }
  return null
}

const GetConsistantController = controller => {
  if (controller) {
    if (!controller.default) {
      return Object.getPrototypeOf(controller)
    }
    return Object.getPrototypeOf(controller.default)
  } else {
    return null
  }
}

const GetMethod = (verb, controller) => {
  const methodNames = Object.getOwnPropertyNames(controller)
  const regex = new RegExp(`${verb}.+`)
  const methodArr = methodNames.filter(m => m.match(regex))

  if (methodArr.length === 1) {
    return methodArr[0]
  }
  return null
}

class BaseController {
  async get (req, res) {
    const controller = await GetController(req)
      .catch(err => { throw err })
      .then(val => { return val })

    const method = GetMethod('get', controller)

    if (controller) {
      controller[method](req, res)
    } else {
      return res.status(404).send({
        success: false,
        message: 'Requested endpoint not found, make sure the version is correct'
      })
    }
  }

  async post (req, res) {
    const controller = await GetController(req)
      .catch(err => { throw err })
      .then(val => { return val })

    const method = GetMethod('post', controller)

    if (controller) {
      controller[method](req, res)
    } else {
      return res.status(404).send({
        success: false,
        message: 'Requested endpoint not found, make sure the version is correct'
      })
    }
  }

  async patch (req, res) {
    const controller = await GetController(req)
      .catch(err => { throw err })
      .then(val => { return val })

    const method = GetMethod('patch', controller)

    if (controller) {
      controller[method](req, res)
    } else {
      return res.status(404).send({
        success: false,
        message: 'Requested endpoint not found, make sure the version is correct'
      })
    }
  }

  async put (req, res) {
    const controller = await GetController(req)
      .catch(err => { throw err })
      .then(val => { return val })

    const method = GetMethod('put', controller)

    if (controller) {
      controller[method](req, res)
    } else {
      return res.status(404).send({
        success: false,
        message: 'Requested endpoint not found, make sure the version is correct'
      })
    }
  }

  async delete (req, res) {
    const controller = await GetController(req)
      .catch(err => { throw err })
      .then(val => { return val })

    const method = GetMethod('delete', controller)

    if (controller) {
      controller[method](req, res)
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
