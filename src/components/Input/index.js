import React, { forwardRef, memo } from 'react';

const Input = (props, forwardedRef) => {
  return (
    <input {...props} ref={forwardedRef}/>
  );
};

export default memo(forwardRef(Input));