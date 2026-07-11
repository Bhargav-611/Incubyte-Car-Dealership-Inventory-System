import React from 'react';
import { Search } from 'lucide-react';

export const SearchBar = ({ make, setMake, model, setModel, onSearch }) => {
  return (
    <form onSubmit={onSearch} className="row g-3 align-items-end mb-4">
      <div className="col-md-5">
        <label className="form-label text-secondary small fw-semibold">Make</label>
        <input
          type="text"
          className="form-control"
          placeholder="e.g. Toyota"
          value={make}
          onChange={(e) => setMake(e.target.value)}
        />
      </div>
      <div className="col-md-5">
        <label className="form-label text-secondary small fw-semibold">Model</label>
        <input
          type="text"
          className="form-control"
          placeholder="e.g. Camry"
          value={model}
          onChange={(e) => setModel(e.target.value)}
        />
      </div>
      <div className="col-md-2 d-grid">
        <button type="submit" className="btn btn-primary d-flex align-items-center justify-content-center gap-1.5 py-2">
          <Search size={16} /> Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
