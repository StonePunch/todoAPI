import { GetAll, GetById, CreateTodo, UpdateTodo, DeleteTodo } from '../data/todoRepo'
import ModelFactory from '../models/modelFactory'
import { modelParser, ActionEnum } from '../entities/modelParser'

class TodosController {
  async getAllTodos (_req, res) {
    GetAll()
      .then(val => {
        if (val.success) {
          return res.status(200).send({
            success: true,
            message: 'Todos were retrieved successfully',
            data: val.data.map(todo => ModelFactory.CreateTodoModel(todo))
          })
        }
        return res.status(404).send({
          success: false,
          message: 'No Todos were found'
        })
      })
  }

  async getTodo (req, res) {
    GetById(req.params.id)
      .then(val => {
        if (val.success) {
          return res.status(200).send({
            success: true,
            message: 'Todo was retrieved successfully',
            data: ModelFactory.CreateTodoModel(val.data)
          })
        }
        return res.status(404).send({
          success: false,
          message: 'Todo does not exist'
        })
      })
  }

  async createTodo (req, res) {
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

    const returnData = await modelParser.ParseTodoModel(
      ActionEnum.POST,
      {
        'id': req.params.id,
        'title': req.body.title,
        'description': req.body.description
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

    CreateTodo(returnData.data)
      .then(val => {
        if (val.success) {
          return res.status(201).send({
            success: true,
            message: 'Todo created successfully',
            data: ModelFactory.CreateTodoModel(val.data)
          })
        }
        return res.status(400).send({
          success: false,
          message: 'Failed to create a new Todo'
        })
      })
  }

  async updateTodo (req, res) {
    const returnData = await modelParser.ParseTodoModel(
      ActionEnum.PATCH,
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

    UpdateTodo(returnData.data)
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

  async replaceTodo (req, res) {
    const returnData = await modelParser.ParseTodoModel(
      ActionEnum.PUT,
      {
        'id': req.params.id,
        'title': req.body.title,
        'description': req.body.description
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

    UpdateTodo(returnData.data)
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
    DeleteTodo(req.params.id)
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
export default todoController
