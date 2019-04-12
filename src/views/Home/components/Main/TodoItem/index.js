import React, { memo, useCallback } from 'react';
import cx                           from 'classnames';

import Input  from 'components/Input';
import Button from 'components/Button';

const TodoItem = ({ todo, onToggle, onDelete }) => {
  const { completed, title } = todo;

  const handleToggle = useCallback(() => {
    onToggle && onToggle(todo);
  }, [todo]);

  return (
    <li className={cx({ completed })}>
      <div className="view">
        <Input
          className="toggle"
          type="checkbox"
          checked={completed}
          onChange={handleToggle}
          value=''
        />
        <label>{title}</label>
        <Button data={todo} className="destroy" onClick={onDelete}/>
      </div>
    </li>
  );
};

export default memo(TodoItem);