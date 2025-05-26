import React from 'react';

interface LoadingProps {
  fullScreen?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function Loading({ fullScreen = true, size = 'md' }: LoadingProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  const containerClasses = fullScreen 
    ? 'fixed inset-0 bg-white flex items-center justify-center z-50' 
    : 'flex items-center justify-center p-4';

  return (
    <div className={containerClasses}>
      <div className={`animate-spin rounded-full border-t-2 border-b-2 border-gray-900 ${sizeClasses[size]}`}></div>
    </div>
  );
} 