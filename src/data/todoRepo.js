import { MongoClient, ObjectID } from 'mongodb'
import Logger from '../helper/logger'
import Todo from '../entities/todo'
import ReturnData from '../dataTypes/returnData'

const DBURL = 'mongodb://localhost:27017'
const DBNAME = 'todos'

// Check if the connection to the db is open
const isServerConnected = (client) => {
  return !!client && !!client.topology && client.topology.isConnected()
}

// Open the connection to the server
const connectServer = async (collectionName) => {
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

    Logger.consoleLog(
      `Error occured while creating a connection to the server`,
      err
    )
    return new ReturnData(false, null, err)
  }
}

export const GetAll = async () => {
  let client, collection
  try {
    ({ client, collection } = await connectServer('todo')
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

    Logger.consoleLog(`Found ${todos.length} Todos`)
    return new ReturnData(true, todos)
  } catch (err) {
    // Make sure the connection to the db is closed
    if (isServerConnected(client)) client.close()

    Logger.consoleLog('Error occured while executing GetAll', err)
    return new ReturnData(false, null, err)
  }
}

export const GetById = async (id) => {
  if (!id) return new ReturnData(false)

  let client, collection
  try {
    ({ client, collection } = await connectServer('todo')
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

    Logger.consoleLog('Found requested Todo')
    return new ReturnData(true, todo)
  } catch (err) {
    // Make sure the connection to the db is closed
    if (isServerConnected(client)) client.close()

    Logger.consoleLog('Error occured while executing GetById', err)
    return new ReturnData(false, null, err)
  }
}

export const CreateTodo = async ({ title, description }) => {
  if (!title || !description) return new ReturnData(false)

  let client, collection
  try {
    ({ client, collection } = await connectServer('todo')
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

    Logger.consoleLog('New Todo has been inserted')

    return new ReturnData(true, todo)
  } catch (err) {
    // Make sure the connection to the db is closed
    if (isServerConnected(client)) client.close()

    Logger.consoleLog('Error occured while executing CreateTodo', err)
    return new ReturnData(false, null, err)
  }
}

export const UpdateTodo = async ({ id, title, description }) => {
  if (!id) return new ReturnData(false)

  // Avoiding nulls in the db
  if (title == null) title = ''
  if (description == null) description = ''

  let client, collection
  try {
    ({ client, collection } = await connectServer('todo')
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

    Logger.consoleLog('Updated Todo')

    return new ReturnData(true)
  } catch (err) {
    // Make sure the connection to the db is closed
    if (isServerConnected(client)) client.close()

    Logger.consoleLog('Error occured while executing UpdateTodo', err)
    return new ReturnData(false, null, err)
  }
}

export const DeleteTodo = async (id) => {
  if (!id) return new ReturnData(false)

  let client, collection
  try {
    ({ client, collection } = await connectServer('todo')
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

    Logger.consoleLog('Deleted Todo')

    return new ReturnData(true)
  } catch (err) {
    // Make sure the connection to the db is closed
    if (isServerConnected(client)) client.close()

    Logger.consoleLog('Error occured while executing DeleteTodo', err)
    return new ReturnData(false, null, err)
  }
}
