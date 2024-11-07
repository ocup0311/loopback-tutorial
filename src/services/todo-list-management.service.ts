import {injectable, BindingScope} from '@loopback/core';
import {TodoListRepository, TodoRepository} from '../repositories';
import {repository} from '@loopback/repository';
import {TodoList, Todo} from '../models';

export interface TodoListManagement {
  createTodoListWithTodos(
    todoListData: TodoList,
    todosData: Todo[],
  ): Promise<TodoList>;
}

@injectable({scope: BindingScope.TRANSIENT})
export class TodoListManagementService implements TodoListManagement {
  constructor(
    @repository(TodoListRepository)
    public todoListRepository: TodoListRepository,
    @repository(TodoRepository)
    public todoRepository: TodoRepository,
  ) {}

  async createTodoListWithTodos(
    todoListData: TodoList,
    todosData: Todo[],
  ): Promise<TodoList> {
    const todoList = await this.todoListRepository.create(todoListData);

    const todos = todosData.map(todoData => ({
      ...todoData,
      todoListId: todoList.id,
    }));

    await this.todoRepository.createAll(todos);

    const resData = await this.todoListRepository.findById(todoList.id, {
      include: ['todos'],
    });

    return resData;
  }
}
