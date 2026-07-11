import React from 'react';

const Spinner = ({ fullPage = false }) => {
  const spinnerElement = (
    <div className="d-flex justify-content-center align-items-center">
      <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  if (fullPage) {
    return (
      <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-white bg-opacity-75" style={{ zIndex: 9999 }}>
        {spinnerElement}
      </div>
    );
  }

  return <div className="p-5">{spinnerElement}</div>;
};

export default Spinner;
