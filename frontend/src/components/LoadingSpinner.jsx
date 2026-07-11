import React from 'react';

export const LoadingSpinner = ({ fullPage = false }) => {
  const spinner = (
    <div className="d-flex justify-content-center align-items-center py-5">
      <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  if (fullPage) {
    return (
      <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-white bg-opacity-75" style={{ zIndex: 9999 }}>
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
