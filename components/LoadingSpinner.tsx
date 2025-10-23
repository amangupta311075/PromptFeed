import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20">
      <div className="w-12 h-12 border-4 border-gray-300 dark:border-slate-600 border-t-brand-blue rounded-full animate-spin mb-4"></div>
      <h2 className="text-xl font-semibold text-gray-700 dark:text-slate-300">Generating Prompts...</h2>
      <p className="text-gray-500 dark:text-slate-500">Our AI is curating the best prompts for you.</p>
    </div>
  );
};

export default LoadingSpinner;