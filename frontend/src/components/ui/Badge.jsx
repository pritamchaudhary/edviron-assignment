import React from 'react';
import { cn } from '../../lib/utils';

const badgeVariants = {
  Success: 'bg-green-100 text-green-800',
  Pending: 'bg-yellow-100 text-yellow-800',
  Failed: 'bg-red-100 text-red-800',
  default: 'bg-gray-100 text-gray-800',
};

const Badge = ({ status }) => {
  const variant = badgeVariants[status] || badgeVariants.default;
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variant
      )}
    >
      {status}
    </span>
  );
};

export default Badge;