import React from 'react';

interface BadgeProps {
  text: string;
  color: 'green' | 'yellow' | 'red' | 'blue';
}

const colorClasses = {
  green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
};

const Badge: React.FC<BadgeProps> = ({ text, color }) => {
  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClasses[color]}`}>
      {text}
    </span>
  );
};

export default Badge;
