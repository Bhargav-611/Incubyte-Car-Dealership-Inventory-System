import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
    <div className="alert alert-danger d-flex align-items-center gap-2 p-3 my-3" role="alert">
      <AlertTriangle size={20} className="flex-shrink-0" />
      <div>{message}</div>
    </div>
  );
};

export default ErrorMessage;
