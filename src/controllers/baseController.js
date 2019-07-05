import path from 'path'
import logger from '../helper/logger'
import controllerSelector from '../routing/controllerSelector'
import ReturnData from '../dataTypes/returnData'

const GetController = async req => {
  try {
    const basePath = path.join(
      __dirname,
      `/../controllers/`
    )

    const returnData = await controllerSelector.GetController(req)
      .catch(err => { throw err })
      .then(val => { return val.data })

    if (!returnData.success) {
      throw returnData.err
    }

    const controller = returnData.data

    if (controller) {
      const controllerSegments = controller.split('\\')
      const controllerName = controllerSegments[0]
      const controllerVersion = controllerSegments[1].split('V')[1]

      logger.consoleLog(`Selected ${controllerName}, version ${controllerVersion} to handle the request`)

      return GetConsistantController(require(path.join(basePath, controller)))
    }
    return null
  } catch (err) {
    logger.consoleLog(
      'Error occured while attempting to retrieve the appropriate controller from the request'
      , err
    )
    return new ReturnData(false, null, err)
  }
}

const GetConsistantController = controller => {
  /*
  // Depending on the export method used for the controller class the property
  // will be different, this method is to fix that discrepancy
  */
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
