import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {TodoListManagementService} from '../services';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {TodoList, Todo} from '../models';
import {TodoListRepository} from '../repositories';
import {
  TodoListSchemaWithTodos,
  TodoListWithTodosRequestBody,
} from './specs/todo-list-controller.specs';

export class TodoListController {
  constructor(
    @repository(TodoListRepository)
    public todoListRepository: TodoListRepository,
    @inject('services.TodoListManagementService')
    public todoListManagementService: TodoListManagementService,
  ) {}

  @post('/todo-lists')
  @response(200, {
    description: 'TodoList model instance',
    content: {'application/json': {schema: getModelSchemaRef(TodoList)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TodoList, {
            title: 'NewTodoList',
            exclude: ['id'],
          }),
        },
      },
    })
    todoList: Omit<TodoList, 'id'>,
  ): Promise<TodoList> {
    return this.todoListRepository.create(todoList);
  }

  @get('/todo-lists/count')
  @response(200, {
    description: 'TodoList model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(TodoList) where?: Where<TodoList>): Promise<Count> {
    return this.todoListRepository.count(where);
  }

  @get('/todo-lists')
  @response(200, {
    description: 'Array of TodoList model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(TodoList, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(TodoList) filter?: Filter<TodoList>,
  ): Promise<TodoList[]> {
    return this.todoListRepository.find(filter);
  }

  @patch('/todo-lists')
  @response(200, {
    description: 'TodoList PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TodoList, {partial: true}),
        },
      },
    })
    todoList: TodoList,
    @param.where(TodoList) where?: Where<TodoList>,
  ): Promise<Count> {
    return this.todoListRepository.updateAll(todoList, where);
  }

  @get('/todo-lists/{id}')
  @response(200, {
    description: 'TodoList model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(TodoList, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(TodoList, {exclude: 'where'})
    filter?: FilterExcludingWhere<TodoList>,
  ): Promise<TodoList> {
    return this.todoListRepository.findById(id, filter);
  }

  @patch('/todo-lists/{id}')
  @response(204, {
    description: 'TodoList PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TodoList, {partial: true}),
        },
      },
    })
    todoList: TodoList,
  ): Promise<void> {
    await this.todoListRepository.updateById(id, todoList);
  }

  @put('/todo-lists/{id}')
  @response(204, {
    description: 'TodoList PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() todoList: TodoList,
  ): Promise<void> {
    await this.todoListRepository.replaceById(id, todoList);
  }

  @del('/todo-lists/{id}')
  @response(204, {
    description: 'TodoList DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.todoListRepository.deleteById(id);
  }

  @post('/todolists/createWithTodos')
  @response(200, {
    description: 'Create a TodoList with multiple Todos',
    content: {
      'application/json': {
        schema: TodoListSchemaWithTodos,
      },
    },
  })
  async createTodoListWithTodos(
    @requestBody(TodoListWithTodosRequestBody)
    reqData: {
      todoList: Omit<TodoList, 'id'>;
      todos: Omit<Todo, 'id'>[];
    },
  ): Promise<TodoList> {
    const {todoList, todos} = reqData;
    return this.todoListManagementService.createTodoListWithTodos(
      todoList,
      todos,
    );
  }
}
