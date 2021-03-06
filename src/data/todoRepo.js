import { MongoClient, ObjectID } from 'mongodb'
import logger from '../helper/logger'
import Todo from '../entities/todo'
import ReturnData from '../dataTypes/returnData'

const DBURL = 'mongodb://localhost:27017'
const DBNAME = 'todos'

const isServerConnected = (client) => {
  return !!client && !!client.topology && client.topology.isConnected()
}

const connectToServer = async (collectionName) => {
  let client
  try {
    // Connect to the db
    client = await MongoClient.connect(`${DBURL}/${DBNAME}`, { useNewUrlParser: true })
      .catch(err => {
        throw err
      })
      .then(val => {
        return val
      })

    const db = client.db(DBNAME)
    const collection = db.collection(collectionName)

    return new ReturnData(true, { client, collection, db })
  } catch (err) {
    // Make sure the connection to the db is closed
    if (isServerConnected(client)) client.close()

    logger.consoleLog(
      `Error occured while creating a connection to the server`,
      err
    )
    return new ReturnData(false, null, err)
  }
}

class TodoRepo {
  async GetAll () {
    let client, collection
    try {
      ({ client, collection } = await connectToServer('todo')
        .catch(err => {
          throw err
        })
        .then(val => {
          return val.data
        })
      )

      // Retrieve the first Todo that matches the filter
      let todos = await collection.find({}).toArray()
        .catch(err => {
          throw err
        })
        .then(val => {
          return val
        })

      client.close()

      if (!todos.length) return new ReturnData(false)

      todos = todos.map(todo =>
        new Todo(todo._id.toHexString(), todo.title, todo.description)
      )

      logger.consoleLog(`Found ${todos.length} Todos`)
      return new ReturnData(true, todos)
    } catch (err) {
      // Make sure the connection to the db is closed
      if (isServerConnected(client)) client.close()

      logger.consoleLog('Error occured while executing GetAll', err)
      return new ReturnData(false, null, err)
    }
  }

  async GetById (id) {
    if (!id) return new ReturnData(false)
    if ([12, 24].indexOf(id.length) === -1) return new ReturnData(false)

    let client, collection
    try {
      ({ client, collection } = await connectToServer('todo')
        .catch(err => {
          throw err
        })
        .then(val => {
          return val.data
        })
      )

      // Retrieve the first Todo that matches the filter
      const todo = await collection.findOne({ '_id': new ObjectID(id) })
        .catch(err => {
          throw err
        })
        .then(val => {
          return new Todo(val._id.toHexString(), val.title, val.description)
        })

      client.close()

      if (!todo) return new ReturnData(false)

      logger.consoleLog('Found requested Todo')
      return new ReturnData(true, todo)
    } catch (err) {
      // Make sure the connection to the db is closed
      if (isServerConnected(client)) client.close()

      logger.consoleLog('Error occured while executing GetById', err)
      return new ReturnData(false, null, err)
    }
  }

  async CreateTodo ({ title, description }) {
    if (!title || !description) return new ReturnData(false)

    let client, collection
    try {
      ({ client, collection } = await connectToServer('todo')
        .catch(err => {
          throw err
        })
        .then(val => {
          return val.data
        })
      )

      const todo = await collection.insertOne({ title, description })
        .catch(err => {
          throw err
        })
        .then(val => {
          return new Todo(val.insertedId.toHexString(), title, description)
        })

      client.close()

      if (!todo) return new ReturnData(false)

      logger.consoleLog('New Todo has been inserted')

      return new ReturnData(true, todo)
    } catch (err) {
      // Make sure the connection to the db is closed
      if (isServerConnected(client)) client.close()

      logger.consoleLog('Error occured while executing CreateTodo', err)
      return new ReturnData(false, null, err)
    }
  }

  async UpdateTodo ({ id, title, description }) {
    if (!id) return new ReturnData(false)
    if ([12, 24].indexOf(id.length) === -1) return new ReturnData(false)

    // Avoiding nulls in the db
    if (title == null) title = ''
    if (description == null) description = ''

    let client, collection
    try {
      ({ client, collection } = await connectToServer('todo')
        .catch(err => {
          throw err
        })
        .then(val => {
          return val.data
        })
      )

      const updatedCount = await collection.updateOne({ '_id': new ObjectID(id) },
        { $set: { title: title, description: description } })
        .catch(err => {
          throw err
        })
        .then(val => {
          return val.result.n
        })

      client.close()

      if (!updatedCount) return new ReturnData(false)

      logger.consoleLog('Updated Todo')

      return new ReturnData(true)
    } catch (err) {
      // Make sure the connection to the db is closed
      if (isServerConnected(client)) client.close()

      logger.consoleLog('Error occured while executing UpdateTodo', err)
      return new ReturnData(false, null, err)
    }
  }

  async DeleteTodo (id) {
    if (!id) return new ReturnData(false)
    if ([12, 24].indexOf(id.length) === -1) return new ReturnData(false)

    let client, collection
    try {
      ({ client, collection } = await connectToServer('todo')
        .catch(err => {
          throw err
        })
        .then(val => {
          return val.data
        })
      )

      const updatedCount = await collection.deleteOne({ '_id': new ObjectID(id) })
        .catch(err => {
          throw err
        })
        .then(val => {
          return val.result.n
        })

      // TODO: Check why Promise.prototype.finally() is not working
      client.close()

      if (!updatedCount) return new ReturnData(false)

      logger.consoleLog('Deleted Todo')

      return new ReturnData(true)
    } catch (err) {
      // Make sure the connection to the db is closed
      if (isServerConnected(client)) client.close()

      logger.consoleLog('Error occured while executing DeleteTodo', err)
      return new ReturnData(false, null, err)
    }
  }
}

const todoRepo = new TodoRepo()
export default todoRepo
