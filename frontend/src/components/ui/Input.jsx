import React from 'react';
import { cn } from '../../lib/utils';

const Input = ({ className, ...props }) => {
  return (
    <input
      className={cn(
        'block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm',
        className
      )}
      {...props}
    />
  );
};

export default Input;