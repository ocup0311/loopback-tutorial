import {SchemaObject} from '@loopback/rest';
import {getModelSchemaRef} from '@loopback/rest';
import {TodoList, Todo} from '../../models';

export const TodoListSchemaWithTodos = {
  type: 'object',
  properties: {
    ...getModelSchemaRef(TodoList).definitions.TodoList.properties,
    todos: {
      type: 'array',
      items: getModelSchemaRef(Todo).definitions.Todo,
    },
  },
};

const TodoListWithTodosSchema: SchemaObject = {
  type: 'object',
  required: ['todoList', 'todos'],
  properties: {
    todoList: getModelSchemaRef(TodoList, {
      title: 'NewTodoList',
      exclude: ['id'],
    }),
    todos: {
      type: 'array',
      title: 'NewTodos in NewTodoList',
      items: getModelSchemaRef(Todo, {
        title: 'NewTodo',
        exclude: ['id', 'todoListId', 'isComplete'],
      }),
    },
  },
};

export const TodoListWithTodosRequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': {schema: TodoListWithTodosSchema},
  },
};
