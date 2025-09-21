import React from 'react';
import { cn } from '../../lib/utils';

const Button = ({ children, className, ...props }) => {
  return (
    <button
      className={cn(
        'w-full px-4 py-2 text-sm font-semibold text-white bg-primary rounded-md shadow-sm hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;