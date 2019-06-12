import express from 'express'
import bodyParser from 'body-parser'
// import routeMapper from './routing/routeMapper'
import router from './routing/router'
import logger from './helper/Logger'

// routeMapper.MapControllersAsync()
//   .catch(err => { throw err })
//   .then(val => {
// Set up the express app
const app = express()

// Parse incoming requests
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// Log Request
app.use((req, _res, next) => {
  if (req) {
    logger.consoleLog(`Request to server for: ${req.path}`)
  }
  next()
})

// app.use(val)

// Assign the router
app.use(router)

const PORT = 5000

app.listen(PORT, () => {
  logger.consoleLog(`Server is running on port http://localhost:${PORT}`)
})
// })
