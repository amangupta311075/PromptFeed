import React from 'react';

interface ErrorDisplayProps {
  message: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 dark:bg-red-900/50 dark:border-red-700 dark:text-red-300 px-4 py-3 rounded-lg my-8 text-center" role="alert">
      <strong className="font-bold">An Error Occurred</strong>
      <p className="block sm:inline ml-2">{message}</p>
    </div>
  );
};

export default ErrorDisplay;