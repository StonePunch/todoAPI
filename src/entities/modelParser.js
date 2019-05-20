import { GetById } from '../data/todoRepo'
import Logger from '../helper/logger'
import Todo from '../entities/todo'
import ReturnData from '../dataTypes/returnData'

const ParseForCreate = async (title, description) => {
  // All fields, besides the id, must be present for the creation of a Todo
  if (!title) return new ReturnData(false)
  if (!description) return new ReturnData(false)

  return new ReturnData(true, new Todo(null, title, description))
}

const ParseForReplace = async (id, title, description) => {
  if (!id) return new ReturnData(false)

  try {
    let todo
    await GetById(id)
      .catch(err => {
        throw err
      })
      .then(val => {
        todo = val.data
      })

    // Check if the Todo exists
    if (!todo) return new ReturnData(false)

    // All fields must be present in order to do a PUT operation
    if (!title) return new ReturnData(false)
    if (!description) return new ReturnData(false)

    return new ReturnData(true, new Todo(id, title, description))
  } catch (err) {
    Logger.consoleLog('Error occured while parsing a model for a replace operation', err)
    return new ReturnData(false, null, err)
  }
}

const ParseForUpdate = async (id, title, description) => {
  if (!id) return new ReturnData(false)

  try {
    let todo
    await GetById(id)
      .catch(err => {
        throw err
      })
      .then(val => {
        todo = val.data
      })

    // Check if the Todo exists
    if (!todo) return new ReturnData(false)

    /*
    // If nothing entered in the title or
    // description fields, maintain previous value
    */
    title = title || todo.title
    description = description || todo.description

    return new ReturnData(true, new Todo(id, title, description))
  } catch (err) {
    Logger.consoleLog('Error occured while parsing a model for a update operation', err)
    return new ReturnData(false, null, err)
  }
}

export const ActionEnum = {
  'GET': 1,
  'POST': 2,
  'PUT': 3,
  'PATCH': 4,
  'DELETE': 5
}

class ModelParser {
  ParseTodoModel (action, { id, title, description }) {
    switch (action) {
      case 2:
        return ParseForCreate(title, description)

      case 3:
        return ParseForReplace(id, title, description)

      case 4:
        return ParseForUpdate(id, title, description)

      default:
        return null
    }
  }
}

export const modelParser = new ModelParser()
