import React from 'react';
import { Edit2, Trash2, RefreshCw } from 'lucide-react';
import { formatPrice } from '../utils';

export const VehicleTable = ({ vehicles, onRestock, onEdit, onDelete }) => {
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle mb-0">
        <thead className="table-light">
          <tr>
            <th scope="col" className="text-secondary small fw-bold">ID</th>
            <th scope="col" className="text-secondary small fw-bold">Make</th>
            <th scope="col" className="text-secondary small fw-bold">Model</th>
            <th scope="col" className="text-secondary small fw-bold">Category</th>
            <th scope="col" className="text-secondary small fw-bold text-end">Price</th>
            <th scope="col" className="text-secondary small fw-bold text-center">Stock</th>
            <th scope="col" className="text-secondary small fw-bold text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center py-4 text-secondary">
                No vehicles found in database. Seed data or add a new record.
              </td>
            </tr>
          ) : (
            vehicles.map((vehicle) => (
              <tr key={vehicle.id}>
                <td className="font-monospace text-secondary small">{vehicle.id}</td>
                <td className="fw-bold text-dark">{vehicle.make}</td>
                <td>{vehicle.model}</td>
                <td>
                  <span className="badge bg-light text-secondary text-uppercase border">{vehicle.category}</span>
                </td>
                <td className="text-end fw-semibold text-primary">
                  {formatPrice(vehicle.price)}
                </td>
                <td className="text-center">
                  {vehicle.quantity === 0 ? (
                    <span className="badge bg-danger">Out of Stock</span>
                  ) : (
                    <span className="badge bg-success">{vehicle.quantity} Units</span>
                  )}
                </td>
                <td className="text-center">
                  <div className="d-inline-flex gap-2">
                    <button className="btn btn-outline-success btn-sm d-flex align-items-center gap-1" onClick={() => onRestock(vehicle)}>
                      <RefreshCw size={14} /> Restock
                    </button>
                    <button className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1" onClick={() => onEdit(vehicle)}>
                      <Edit2 size={14} /> Edit
                    </button>
                    <button className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1" onClick={() => onDelete(vehicle)}>
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VehicleTable;
