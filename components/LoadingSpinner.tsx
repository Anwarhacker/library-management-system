
import React from 'react';

interface LoadingSpinnerProps {
  small?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ small = false }) => {
  const sizeClasses = small ? 'h-5 w-5' : 'h-8 w-8';
  const borderClasses = small ? 'border-2' : 'border-4';

  return (
    <div className="inline-flex items-center justify-center mx-4">
      <div className={`${sizeClasses} ${borderClasses} border-t-transparent border-blue-500 rounded-full animate-spin`}></div>
    </div>
  );
};

export default LoadingSpinner;
