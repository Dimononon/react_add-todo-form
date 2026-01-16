import React, { useState } from 'react';
import { Todo, User } from '../../types';

import { getUserById } from '../../use_cases/getUserById';

type Props = {
  possibleUsers: User[];
  nextId: number;
  onAdd: (todo: Todo) => void;
};

export const TodoForm: React.FC<Props> = ({ possibleUsers, nextId, onAdd }) => {
  const [title, setTitle] = useState('');
  const [userId, setUserId] = useState(0);
  const [isTitleValid, setIsTitleValid] = useState(true);
  const [isUserSelected, setisUserSelected] = useState(true);

  const handleSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsTitleValid(title.trim().length > 0);
    setisUserSelected(userId !== 0);

    if (!(title.trim().length > 0) || !(userId !== 0)) {
      return;
    }

    const todo: Todo = {
      id: nextId,
      title,
      completed: false,
      userId,
      user: getUserById(possibleUsers, userId),
    };

    setTitle('');
    setUserId(0);
    setIsTitleValid(true);
    setisUserSelected(true);

    onAdd(todo);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const cleanTitle = event.target.value.replace(
      /[^a-zA-Zа-яА-ЯіІїЇєЄґҐ0-9\s]/g,
      '',
    );

    setTitle(cleanTitle);
    setIsTitleValid(true);
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setUserId(+event.target.value);
    setisUserSelected(true);
  };

  return (
    <form action="/api/todos" method="POST" onSubmit={handleSubmitForm}>
      <div className="field">
        <label className="label" htmlFor="title">
          Title:
        </label>
        <input
          type="text"
          data-cy="titleInput"
          id="title"
          value={title}
          onChange={handleInputChange}
          placeholder="Please enter title"
        />
        {!isTitleValid && <span className="error">Please enter a title</span>}
      </div>

      <div className="field">
        <label className="label" htmlFor="user">
          User:
        </label>
        <select
          id="user"
          data-cy="userSelect"
          value={userId}
          onChange={handleSelectChange}
        >
          <option value="0" disabled>
            Choose a user
          </option>
          {possibleUsers.map((user: User) => {
            return (
              <option value={user.id} key={user.id}>
                {user.name}
              </option>
            );
          })}
        </select>

        {!isUserSelected && <span className="error">Please choose a user</span>}
      </div>

      <button type="submit" data-cy="submitButton">
        Add
      </button>
    </form>
  );
};
