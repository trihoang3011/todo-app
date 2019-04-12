import React, { memo, useRef, useCallback } from 'react';

import Input                     from 'components/Input';
import { useHomeActionsContext } from 'views/Home/context';

const ENTER_KEY = 13;

const Header = () => {
  const { insertItem } = useHomeActionsContext();
  const inputRef       = useRef(null);

  const handleKeyDown = useCallback((e) => {
    if (e.keyCode !== ENTER_KEY) {
      return;
    }

    e.preventDefault();
    const title            = e.target.value.trim();
    inputRef.current.value = '';
    insertItem({ title });
  }, []);

  return (
    <header className="header">
      <h1>todos</h1>
      <Input
        className="new-todo"
        placeholder="Enter todo name here"
        autoFocus
        onKeyDown={handleKeyDown}
        ref={inputRef}
      />
    </header>
  );
};

export default memo(Header);