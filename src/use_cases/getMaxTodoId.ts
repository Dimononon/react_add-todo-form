import { Todo } from '../types';

export function getMaxTodoId(todos: Todo[]) {
  return Math.max(...todos.map(todo => todo.id));
}
