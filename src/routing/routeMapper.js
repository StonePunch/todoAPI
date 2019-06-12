import fs from 'fs'
import path from 'path'
import express from 'express'
import { promisify } from 'util'

class RouteMapper {
  async MapControllersAsync () {
    const basePath = path.join(
      __dirname,
      `/../controllers/`
    )

    // Makes it so that 'readdir' returns a promise instead of requiring a callback function
    const readdir = promisify(fs.readdir)

    // Get the name of all the directories holding cotrollers
    const controllerDirectoriesName = await readdir(basePath)
      .catch(err => { throw err })
      .then(val => { return val })

    const promises = []
    for (let i = 0; i < controllerDirectoriesName.length; i++) {
      const promise = new Promise(async (resolve, reject) => {
        try {
          const controllerDirectoryPath = path.join(basePath, controllerDirectoriesName[i])

          // Get the name of all the controllers inside a directory
          let controllersName = await readdir(controllerDirectoryPath)
            .catch(err => { throw err })
            .then(val => { return val })

          // Validation to avoid problems with the .maps
          controllersName = controllersName.filter(val => val.match(/^.+V[0-9]+\.[0-9]+\.js$/))

          const controllers = []
          for (let i = 0; i < controllersName.length; i++) {
            const controllerPath = path.join(controllerDirectoryPath, controllersName[i])

            const controller = require(controllerPath)

            controllers.push({ controllerPath, controller: controller })
          }
          resolve(controllers)
        } catch (err) {
          reject(err)
        }
      })
      promises.push(promise)
    }

    const controllers = (await Promise.all(promises)
      .catch(err => { throw err })
      .then(val => { return val }))
      .flat()

    const router = express.Router()
    const BASEROUTE = '/api/todo'
    for (let i = 0; i < controllers.length; i++) {
      // Object with the methods found in the prototype of the controller, includes
      // both the constructor and the prototype methods
      const controllerFunctions = Object.getPrototypeOf(controllers[i].controller)

      // Names of all the methods in the passed controller, excluding the prototype
      const methodNames = Object.getOwnPropertyNames(controllerFunctions)

      // Iteration starts at 1 to avoid going over the constructor
      for (let i = 1; i < methodNames.length; i++) {
        const methodName = methodNames[i]
        if (methodName.match(/get.+/)) {
          router.get(BASEROUTE, controllerFunctions[methodNames[i]])
          router.get(`${BASEROUTE}/:id`, controllerFunctions[methodNames[i]])
        } else if (methodName.match(/post.+/)) {
          router.post(BASEROUTE, controllerFunctions[methodNames[i]])
        } else if (methodName.match(/patch.+/)) {
          router.patch(`${BASEROUTE}/:id`, controllerFunctions[methodNames[i]])
        } else if (methodName.match(/put.+/)) {
          router.put(`${BASEROUTE}/:id`, controllerFunctions[methodNames[i]])
        } else if (methodName.match(/delete.+/)) {
          router.delete(`${BASEROUTE}/:id`, controllerFunctions[methodNames[i]])
        }
      }
    }
    return router
  }
}

const routeMapper = new RouteMapper()
export default routeMapper
