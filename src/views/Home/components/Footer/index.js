import './index.scss';
import React, { memo, useCallback, useState } from 'react';
import cx                                     from 'classnames';
import { size }                               from 'lodash';

import { ACTION_TYPES }                               from 'consts';
import Button                                         from 'components/Button';
import { useHomeActionsContext, useHomeStateContext } from 'views/Home/context';

const Footer = () => {
  const { filterItems, toggleItems } = useHomeActionsContext();
  const { filteredData, data }       = useHomeStateContext();
  const [state, setState]            = useState({ showBy: ACTION_TYPES.SHOW_ALL });

  const handleFilter = useCallback((showBy) => {
    filterItems && filterItems(showBy);
    setState(prev => {
      return {
        ...prev,
        showBy,
      };
    });
  }, []);

  if (size(data) === 0) {
    return null;
  }

  return (
    <footer className="footer">
      <Button className='btn-toggle-all' data={filteredData} onClick={toggleItems}>
        Toggle all
      </Button>
      <ul className="filters">
        <li>
          <Button
            onClick={handleFilter}
            className={cx({ selected: state.showBy === ACTION_TYPES.SHOW_ALL })}
            data={ACTION_TYPES.SHOW_ALL}>All</Button>
        </li>
        {' '}
        <li>
          <Button
            className={cx({ selected: state.showBy === ACTION_TYPES.SHOW_ACTIVE })}
            onClick={handleFilter} data={ACTION_TYPES.SHOW_ACTIVE}>Active</Button>
        </li>
        {' '}
        <li>
          <Button
            className={cx({ selected: state.showBy === ACTION_TYPES.SHOW_COMPLETED })}
            onClick={handleFilter} data={ACTION_TYPES.SHOW_COMPLETED}>Done</Button>
        </li>
      </ul>
    </footer>
  );
};

export default memo(Footer);