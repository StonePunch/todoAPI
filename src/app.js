import express from 'express'
import bodyParser from 'body-parser'
import router from './routes/router'
import Logger from './helper/Logger'

// Set up the express app
const app = express()

// Parse incoming requests
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// Log Request
app.use((req, res, next) => {
  if (req) {
    Logger.consoleLog(`Request to server for: ${req.url}`)
  }
  next()
})

// Assign the router
app.use(router)

const PORT = 5000

app.listen(PORT, () => {
  Logger.consoleLog(`Server is running on port http://localhost:${PORT}`)
})
