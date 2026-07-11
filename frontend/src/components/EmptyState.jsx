import React from 'react';
import { Search } from 'lucide-react';

export const EmptyState = ({ title = "No Results Found", message = "We couldn't find what you were looking for. Try adjusting your search query or filters.", onReset }) => {
  return (
    <div className="text-center py-5 px-4 bg-white rounded shadow-sm border my-4">
      <div className="bg-light text-secondary p-3 rounded-circle d-inline-block mb-3">
        <Search size={32} />
      </div>
      <h5 className="fw-bold text-dark mb-2">{title}</h5>
      <p className="text-secondary small mb-4 mx-auto" style={{ maxWidth: '380px' }}>{message}</p>
      {onReset && (
        <button className="btn btn-outline-primary btn-sm px-4" onClick={onReset}>
          Reset Filters
        </button>
      )}
    </div>
  );
};

export default EmptyState;
