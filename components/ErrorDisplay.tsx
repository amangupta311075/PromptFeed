
import React from 'react';

interface ErrorDisplayProps {
  message: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
  return (
    <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg my-8 text-center" role="alert">
      <strong className="font-bold">An Error Occurred</strong>
      <p className="block sm:inline ml-2">{message}</p>
    </div>
  );
};

export default ErrorDisplay;
