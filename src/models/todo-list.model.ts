import {Entity, model, property, hasMany, hasOne} from '@loopback/repository';
import {Todo, TodoWithRelations} from './todo.model';
import {
  TodoListImage,
  TodoListImageWithRelations,
} from './todo-list-image.model';

@model()
export class TodoList extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  title: string;

  @property({
    type: 'string',
  })
  color?: string;

  @hasMany(() => Todo)
  todos: Todo[];

  @hasOne(() => TodoListImage)
  image: TodoListImage;

  constructor(data?: Partial<TodoList>) {
    super(data);
  }
}

export interface TodoListRelations {
  // describe navigational properties here
  todos?: TodoWithRelations[];
  image?: TodoListImageWithRelations;
}

export type TodoListWithRelations = TodoList & TodoListRelations;
