import express from 'express'
import bodyParser from 'body-parser'
import router from './routing/router'
import logger from './helper/Logger'

const app = express()

// Parse incoming requests
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// Log incoming request
app.use((req, _res, next) => {
  if (req) {
    logger.consoleLog(`Request to server for: ${req.path}`)
  }
  next()
})

// Take care of all the routing
app.use(router)

const PORT = 5000
app.listen(PORT, () => {
  logger.consoleLog(`Server is running on port http://localhost:${PORT}`)
})
