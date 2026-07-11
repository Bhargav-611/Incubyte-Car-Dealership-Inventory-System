import React from 'react';
import { Link } from 'react-router-dom';
import { Car } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="container text-center my-5 py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <Car size={80} className="text-secondary mb-4" />
          <h1 className="display-1 fw-bold text-dark">404</h1>
          <h2 className="fw-semibold text-secondary mb-3">Page Not Found</h2>
          <p className="text-muted mb-4">The page you are looking for does not exist or has been moved.</p>
          <Link to="/" className="btn btn-primary px-4 py-2">Go to Dashboard</Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
