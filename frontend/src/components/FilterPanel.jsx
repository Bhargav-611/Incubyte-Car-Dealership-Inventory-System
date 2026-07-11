import React from 'react';
import { SlidersHorizontal, RotateCcw, Search } from 'lucide-react';
import { CATEGORIES } from '../constants';

export const FilterPanel = ({
  make, setMake,
  model, setModel,
  category, setCategory,
  minPrice, setMinPrice,
  maxPrice, setMaxPrice,
  onSearch, onReset
}) => {
  return (
    <div className="card filter-panel">
      <div className="d-flex align-items-center gap-2 mb-3">
        <SlidersHorizontal size={18} className="text-primary" />
        <h5 className="mb-0 fw-bold">Filters & Search</h5>
      </div>
      
      <form onSubmit={onSearch}>
        <div className="mb-3">
          <label className="form-label text-secondary small fw-semibold">Make</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. Tesla"
            value={make}
            onChange={(e) => setMake(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label text-secondary small fw-semibold">Model</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. Model Y"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label text-secondary small fw-semibold">Category</label>
          <select
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option value={cat} key={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label text-secondary small fw-semibold">Min Price ($)</label>
          <input
            type="number"
            className="form-control"
            placeholder="0"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="form-label text-secondary small fw-semibold">Max Price ($)</label>
          <input
            type="number"
            className="form-control"
            placeholder="150000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>

        <div className="d-grid gap-2">
          <button type="submit" className="btn btn-primary d-flex align-items-center justify-content-center gap-1.5 py-2">
            <Search size={16} /> Apply Filters
          </button>
          <button type="button" className="btn btn-outline-secondary d-flex align-items-center justify-content-center gap-1.5 py-2" onClick={onReset}>
            <RotateCcw size={16} /> Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default FilterPanel;
