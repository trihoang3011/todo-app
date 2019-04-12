import './index.scss';
import React, { memo, useCallback } from 'react';
import { size }                     from 'lodash';

import { useHomeStateContext, useHomeActionsContext } from 'views/Home/context';
import TodoItem                                       from './TodoItem';

const Main = () => {
  const { updateItem, removeItem } = useHomeActionsContext();
  const { loading, filteredData }  = useHomeStateContext();

  const handleToggle = useCallback((item) => {
    updateItem({ ...item, completed: !item.completed });
  }, []);

  if (size(filteredData) === 0 && loading) {
    return (
      <div className="main spinner">
        <div className="rect1"></div>
        <div className="rect2"></div>
        <div className="rect3"></div>
        <div className="rect4"></div>
        <div className="rect5"></div>
      </div>
    );
  }

  return (
    <section className='main'>
      <ul className="todo-list">
        {filteredData.map(todo => {
          return (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={handleToggle}
              onDelete={removeItem}
            />
          );
        })}
      </ul>
    </section>
  );
};

export default memo(Main);