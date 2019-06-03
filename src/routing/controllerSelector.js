import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

const GetController = async url => {
  const controller = url.match(/\/api\/([a-zA-Z]+)/)

  if (!controller) return null

  return controller[1]
}

const IsVersionAvailable = async (controller, version) => {
  const controllerDirectory = path.join(
    __dirname,
    `/../controllers/${controller}Controller/`
  )

  // Required to avoid using the callback function
  // Reference: https://nodejs.org/dist/latest-v8.x/docs/api/util.html#util_util_promisify_original
  const readdir = promisify(fs.readdir)
  const files = await readdir(controllerDirectory)
    .catch(err => {
      throw err
    })
    .then(val => {
      return val
    })

  for (let i = 0; i < files.length; i++) {
    let controllerVersion = files[i].match(/V([0-9]+\.[0-9]+)\.js/)

    // Skip iteration
    if (!controllerVersion) continue

    controllerVersion = controllerVersion[1]
    if (controllerVersion === version) return true
  }
  return false
}

const GetVersionFromAcceptHeaderVersion = async req => {
  const acceptHeader = req.header('Accept')

  if (!acceptHeader) return null

  let version = acceptHeader.match(/version=([0-9]+\.[0-9]+)/)

  if (!version) return null

  version = version[1]
  const model = await GetController(req.url)
    .catch(err => {
      throw err
    })
    .then(val => {
      return val
    })

  const isAvailable = await IsVersionAvailable(model, version)
    .catch(err => {
      throw err
    })
    .then(val => {
      return val
    })

  if (!isAvailable) return null

  const controller = `${model}ControllerV${version}`
  return controller
}

const GetVersionFromCustomHeader = async req => {
  const customHeader = req.header('X-Todo-Version')

  if (!customHeader) return null

  let version = customHeader.match(/([0-9]+\.[0-9]+)/)

  if (!version) return null

  version = version[1]
  const model = await GetController(req.url)
    .catch(err => {
      throw err
    })
    .then(val => {
      return val
    })

  const isAvailable = await IsVersionAvailable(model, version)
    .catch(err => {
      throw err
    })
    .then(val => {
      return val
    })

  if (!isAvailable) return null

  const controller = `${model}ControllerV${version}`
  return controller
}

const GetVersionFromQueryString = async req => {
  const queryValue = req.query.version

  if (!queryValue) return null

  let version = queryValue.match(/([0-9]+\.[0-9]+)/)

  if (!version) return null

  version = version[1]
  const model = await GetController(req.url)
    .catch(err => {
      throw err
    })
    .then(val => {
      return val
    })

  const isAvailable = await IsVersionAvailable(model, version)
    .catch(err => {
      throw err
    })
    .then(val => {
      return val
    })

  if (!isAvailable) return null

  const controller = `${model}ControllerV${version}`
  return controller
}

class ControllerSelector {
  async GetController (req, _res) {
    let controller

    controller = await GetVersionFromAcceptHeaderVersion(req)
      .catch(err => {
        throw err
      })
      .then(val => {
        return val
      })

    if (controller) return controller

    controller = await GetVersionFromCustomHeader(req)
      .catch(err => {
        throw err
      })
      .then(val => {
        return val
      })

    if (controller) return controller

    controller = await GetVersionFromQueryString(req)
      .catch(err => {
        throw err
      })
      .then(val => {
        return val
      })

    return controller
  }
}

const controllerSelector = new ControllerSelector()
export default controllerSelector
