import todoRepo from '../../data/todoRepo'
import modelFactory from '../../models/modelFactory'
import modelParser from '../../entities/modelParser'

class TodosController {
  async getTodo (req, res) {
    if (req.params.id) {
      todoRepo.GetById(req.params.id)
        .then(val => {
          if (val.success) {
            return res.status(200).send({
              success: true,
              message: 'Todo was retrieved successfully',
              data: modelFactory.CreateTodoModel(val.data)
            })
          }
          return res.status(404).send({
            success: false,
            message: 'Todo does not exist'
          })
        })
    } else {
      todoRepo.GetAll()
        .then(val => {
          if (val.success) {
            return res.status(200).send({
              success: true,
              message: 'Todos were retrieved successfully',
              data: val.data.map(todo => modelFactory.CreateTodoModel(todo))
            })
          }
          return res.status(404).send({
            success: false,
            message: 'No Todos were found'
          })
        })
    }
  }

  async postTodo (req, res) {
    if (!req.body.title) {
      return res.status(400).send({
        success: false,
        message: 'Title is required'
      })
    }

    if (!req.body.description) {
      return res.status(400).send({
        success: false,
        message: 'Description is required'
      })
    }

    const returnData = await modelParser.ParseForCreate(
      {
        title: req.body.title,
        description: req.body.description
      })
      .then(val => {
        return val
      })

    if (!returnData.success) {
      return res.status(400).send({
        success: false,
        message: 'Provided information is incorrect'
      })
    }

    todoRepo.CreateTodo(returnData.data)
      .then(val => {
        if (val.success) {
          return res.status(201).send({
            success: true,
            message: 'Todo created successfully',
            data: modelFactory.CreateTodoModel(val.data)
          })
        }
        return res.status(400).send({
          success: false,
          message: 'Failed to create a new Todo'
        })
      })
  }

  async patchTodo (req, res) {
    const returnData = await modelParser.ParseForUpdate(
      {
        id: req.params.id,
        title: req.body.title,
        description: req.body.description
      })
      .then(val => {
        return val
      })

    if (!returnData.success) {
      return res.status(400).send({
        success: false,
        message: 'Provided information is incorrect'
      })
    }

    todoRepo.UpdateTodo(returnData.data)
      .then(val => {
        if (val.success) {
          return res.status(204).send({
            success: true,
            message: 'Todo updated successfully'
          })
        }
        return res.status(400).send({
          success: false,
          message: 'Failed to update the Todo'
        })
      })
  }

  async putTodo (req, res) {
    const returnData = await modelParser.ParseForReplace(
      {
        id: req.params.id,
        title: req.body.title,
        description: req.body.description
      })
      .then(val => {
        return val
      })

    if (!returnData.success) {
      return res.status(400).send({
        success: false,
        message: 'Provided information is incorrect'
      })
    }

    todoRepo.UpdateTodo(returnData.data)
      .then(val => {
        if (val.success) {
          return res.status(204).send({
            success: true,
            message: 'Todo updated successfully'
          })
        }
        return res.status(400).send({
          success: false,
          message: 'Failed to update the Todo'
        })
      })
  }

  async deleteTodo (req, res) {
    todoRepo.DeleteTodo(req.params.id)
      .then(val => {
        if (val.success) {
          return res.status(204).send({
            success: true,
            message: 'Todo was deleted successfully'
          })
        }
        return res.status(404).send({
          success: false,
          message: 'Todo not found'
        })
      })
  }
}

const todoController = new TodosController()
module.exports = todoController
