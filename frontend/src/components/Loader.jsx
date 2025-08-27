import React from 'react';

const Loader = ({ size = 'medium', text = 'Loading' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`${sizeClasses[size]} border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin`} />
      {text && (
        <p className="mt-4 text-gray-600 loading-dots">{text}</p>
      )}
    </div>
  );
};

// Page loader
export const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <Loader size="large" text="Loading" />
  </div>
);

// Button loader
export const ButtonLoader = ({ size = 'small' }) => (
  <div className={`${size === 'small' ? 'w-4 h-4' : 'w-5 h-5'} border-2 border-white border-t-transparent rounded-full animate-spin`} />
);

// Video grid skeleton
export const VideoGridSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
    {Array.from({ length: 12 }, (_, index) => (
      <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse">
        <div className="aspect-video bg-gray-200" />
        <div className="p-3">
          <div className="flex space-x-3">
            <div className="w-9 h-9 bg-gray-200 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
              <div className="h-3 bg-gray-200 rounded w-1/3" />
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default Loader;