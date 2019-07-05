import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import logger from '../helper/logger'
import ReturnData from '../dataTypes/returnData'

// Helper Functions

const GetWithPrecision = async num => {
  let value = Number(num)
  const res = typeof (num) === 'string' ? num.split('.') : num.toString().split('.')
  if (res.length === 1) {
    value = value.toFixed(1)
  }
  return value
}

const GetControllerFromUrl = async url => {
  const controller = url.match(/\/api\/([a-zA-Z]+)/)

  if (!controller) return null

  return controller[1]
}

const IsVersionAvailable = async (model, version) => {
  try {
    const controllerDirectory = path.join(
      __dirname,
      `/../controllers/${model}Controller/`
    )

    // Required to avoid using the callback function
    // Reference: https://nodejs.org/dist/latest-v8.x/docs/api/util.html#util_util_promisify_original
    const readdir = promisify(fs.readdir)
    const files = await readdir(controllerDirectory)
      .catch(err => { throw err })
      .then(val => { return val })

    for (let i = 0; i < files.length; i++) {
      let controllerVersion = files[i].match(/V([0-9]+\.[0-9]+)\.js/)

      // Skip iteration
      if (!controllerVersion) continue

      controllerVersion = controllerVersion[1]
      if (controllerVersion === version) {
        return new ReturnData(true)
      }
    }
    // The controller/version combination does not exist
    return new ReturnData(false)
  } catch (err) {
    logger.consoleLog(
      'Error occured while executing IsVersionAvailable ' +
      `with the inputs ${model} and ${version}`
      , err
    )
    return new ReturnData(false, null, err)
  }
}

// Versioning

const GetVersionFromAcceptHeaderVersion = async req => {
  try {
    const acceptHeader = req.header('Accept')

    if (!acceptHeader) return new ReturnData(false)

    let version = acceptHeader.match(/version=([0-9]+\.[0-9]+)/)

    if (!version) return new ReturnData(false)

    version = version[1]
    const model = await GetControllerFromUrl(req.url)
      .catch(err => { throw err })
      .then(val => { return val })

    const returnData = await IsVersionAvailable(model, version)
      .catch(err => { throw err })
      .then(val => { return val })

    if (!returnData.success) return new ReturnData(false)

    const controller = `${model}ControllerV${version}`
    return new ReturnData(true, path.join(`${model}Controller`, controller))
  } catch (err) {
    logger.consoleLog(
      'Error occured while executing GetVersionFromAcceptHeaderVersion'
      , err
    )
    return new ReturnData(false, null, err)
  }
}

const GetVersionFromCustomHeader = async req => {
  try {
    const customHeader = req.header('X-Todo-Version')

    if (!customHeader) return new ReturnData(false)

    let version = customHeader.match(/([0-9]+\.[0-9]+)/)

    if (!version) return new ReturnData(false)

    version = version[1]
    const model = await GetControllerFromUrl(req.url)
      .catch(err => { throw err })
      .then(val => { return val })

    const returnData = await IsVersionAvailable(model, version)
      .catch(err => { throw err })
      .then(val => { return val })

    if (!returnData.success) return new ReturnData(false)

    const controller = `${model}ControllerV${version}`
    return new ReturnData(true, path.join(`${model}Controller`, controller))
  } catch (err) {
    logger.consoleLog(
      'Error occured while executing GetVersionFromCustomHeader'
      , err
    )
    return new ReturnData(false, null, err)
  }
}

const GetVersionFromQueryString = async req => {
  try {
    const queryValue = req.query.version

    if (!queryValue) return new ReturnData(false)

    let version = queryValue.match(/([0-9]+\.[0-9]+)/)

    if (!version) return new ReturnData(false)

    version = version[1]
    const model = await GetControllerFromUrl(req.url)
      .catch(err => { throw err })
      .then(val => { return val })

    const returnData = await IsVersionAvailable(model, version)
      .catch(err => { throw err })
      .then(val => { return val })

    if (!returnData.success) return new ReturnData(false)

    const controller = `${model}ControllerV${version}`
    return new ReturnData(true, path.join(`${model}Controller`, controller))
  } catch (err) {
    logger.consoleLog(
      'Error occured while executing GetVersionFromQueryString'
      , err
    )
    return new ReturnData(false, null, err)
  }
}

const GetMostRecentVersion = async req => {
  try {
    const model = await GetControllerFromUrl(req.url)
      .catch(err => { throw err })
      .then(val => { return val })

    const controllerDirectory = path.join(
      __dirname,
      `/../controllers/${model}Controller/`
    )

    // Required to avoid using the callback function
    // Reference: https://nodejs.org/dist/latest-v8.x/docs/api/util.html#util_util_promisify_original
    const readdir = promisify(fs.readdir)
    let files = await readdir(controllerDirectory)
      .catch(err => { throw err })
      .then(val => { return val })

    let versions = []
    for (let i = 0; i < files.length; i++) {
      let controllerVersion = files[i].match(/V([0-9]+\.[0-9]+)\.js/)

      if (!controllerVersion) continue

      versions.push(controllerVersion[1])
    }

    let mostRecentVersion = Math.max(...versions.map(val => parseFloat(val)))
    mostRecentVersion = await GetWithPrecision(mostRecentVersion)
      .catch(err => { throw err })
      .then(val => { return val })

    const controller = `${model}ControllerV${mostRecentVersion}`
    return new ReturnData(true, path.join(`${model}Controller`, controller))
  } catch (err) {
    logger.consoleLog(
      'Error occured while executing GetMostRecentVersion'
      , err
    )
    return new ReturnData(false, null, err)
  }
}

class ControllerSelector {
  async GetController (req, _res) {
    try {
      let returnData

      returnData = await GetVersionFromAcceptHeaderVersion(req)
        .catch(err => { throw err })
        .then(val => { return val })

      if (returnData.success) return new ReturnData(true, returnData)

      returnData = await GetVersionFromCustomHeader(req)
        .catch(err => { throw err })
        .then(val => { return val })

      if (returnData.success) return new ReturnData(true, returnData)

      returnData = await GetVersionFromQueryString(req)
        .catch(err => { throw err })
        .then(val => { return val })

      if (returnData.success) return new ReturnData(true, returnData)

      returnData = await GetMostRecentVersion(req)
        .catch(err => { throw err })
        .then(val => { return val })

      return new ReturnData(true, returnData)
    } catch (err) {
      logger.consoleLog(
        'Error occured while attempting to retrieve the appropriate controller from the request'
        , err
      )
      return new ReturnData(false, null, err)
    }
  }
}

const controllerSelector = new ControllerSelector()
export default controllerSelector
