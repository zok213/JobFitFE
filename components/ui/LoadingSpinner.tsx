import React from 'react';

type LoadingSpinnerProps = {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'white';
};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  color = 'primary' 
}) => {
  // Map size to class names
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  // Map color to class names
  const colorClasses = {
    primary: 'text-green-500',
    secondary: 'text-blue-500',
    white: 'text-white',
  };

  return (
    <div className="flex justify-center items-center">
      <div className={`animate-spin rounded-full border-t-2 border-b-2 ${colorClasses[color]} ${sizeClasses[size]}`}></div>
    </div>
  );
};

export default LoadingSpinner; 