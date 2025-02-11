/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';
interface Props {
  todos: Todo[];
  onDelete: (id: number) => void;
  isLoading: boolean;
}

export const TodoList: React.FC<Props> = ({ todos, isLoading, onDelete }) => (
  <>
    {todos.map(todo => (
      <div
        key={todo.id}
        data-cy="Todo"
        className={classNames('todo', { completed: todo.completed })}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
          />
        </label>

        <span data-cy="TodoTitle" className="todo__title">
          {todo.title}
        </span>

        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDelete(todo.id)}
        >
          ×
        </button>

        <div
          data-cy="TodoLoader"
          className={`modal overlay ${isLoading && 'is-active'}`}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    ))}
  </>
);
