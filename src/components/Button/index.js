import React, { memo, useCallback } from 'react';

const Button = ({ children, data, type = 'button', onClick, ...rest }) => {
  const handleClick = useCallback(() => {
    onClick && onClick(data);
  }, [data]);

  return (
    <button type={type} {...rest} onClick={handleClick}>
      {children}
    </button>
  );
};

export default memo(Button);