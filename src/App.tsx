import React, { useState, useEffect, useRef } from 'react';
import { getTodos, createTodo } from './api/todos';
import { TodoList } from './components/TodoList';
import { UserWarning } from './UserWarning';
import { Loader } from './components/Loader';
import { Todo } from './types/Todo';
import classNames from 'classnames';
import { Footer } from './components/Footer';
import FilterStatus from './enums/FilterStatus';

const USER_ID = 2338;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>(
    FilterStatus.All,
  );
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadTodos = async () => {
    setIsLoading(true);
    setErrorMessage('');
    setShowError(false);
    try {
      const loadedTodos = await getTodos();

      setTodos(loadedTodos);
    } catch (error) {
      setErrorMessage('Unable to load todos');
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
    if (inputRef.current) {
      inputRef.current.focus();
    }

    return () => {
      setErrorMessage('');
    };
  }, []);

  const handleCreateTodo = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTodoTitle.trim()) {
      setErrorMessage('Title should not be empty');
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);

      return;
    }

    setIsAddingTodo(true);
    setErrorMessage('');
    setShowError(false);

    try {
      const newTodo = await createTodo(newTodoTitle);

      setTodos(prevTodos => [...prevTodos, newTodo]);
      setNewTodoTitle('');
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } catch (error) {
      setErrorMessage('Unable to add a todo');
      setShowError(true);
    } finally {
      setIsAddingTodo(false);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    setIsLoading(true);
    setErrorMessage('');
    setShowError(false);
    try {
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTodos = todos.filter(todo => {
    switch (filterStatus) {
      case FilterStatus.Active:
        return !todo.completed;
      case FilterStatus.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  if (!USER_ID) {
    setShowError(true);

    return <UserWarning />;
  }

  const hideError = () => {
    setErrorMessage('');
    setShowError(false);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: todos.every(todo => todo.completed),
              })}
              data-cy="ToggleAllButton"
            />
          )}
          <form onSubmit={handleCreateTodo}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodoTitle}
              onChange={e => setNewTodoTitle(e.target.value)}
              disabled={isAddingTodo}
              ref={inputRef}
            />
          </form>
        </header>
        <section className="todoapp__main" data-cy="TodoList">
          {isLoading ? (
            <Loader />
          ) : (
            <TodoList
              todos={filteredTodos}
              onDelete={handleDeleteTodo}
              isLoading={isLoading}
            />
          )}
        </section>
        {todos.length > 0 && (
          <Footer
            todos={todos}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            className="todoapp__footer"
            data-cy="Footer"
          />
        )}
      </div>
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          {
            hidden: !showError,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={hideError}
        />
        {errorMessage}
      </div>
    </div>
  );
};
