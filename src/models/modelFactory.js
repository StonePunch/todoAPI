import TodoModel from '../models/todoModel'

class ModelFactory {
  CreateTodoModel ({ id, title, description }) {
    return new TodoModel(id, title, description)
  }
}

const modelFactory = new ModelFactory()
export default modelFactory
