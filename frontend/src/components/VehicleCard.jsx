import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye } from 'lucide-react';
import { formatPrice } from '../utils';

export const VehicleCard = ({ vehicle, onPurchase }) => {
  const isOutOfStock = vehicle.quantity === 0;
  const isLowStock = vehicle.quantity > 0 && vehicle.quantity < 5;

  return (
    <div className="card h-100 vehicle-card transition-transform hover-translate-y">
      <div className="vehicle-card__media">
        <div>
          <span className="vehicle-card__badge">{vehicle.category}</span>
          <h4 className="card-title fw-bold mt-3 mb-1">{vehicle.make}</h4>
          <p className="mb-0 text-white-50">{vehicle.model}</p>
        </div>
        <div className="vehicle-card__accent" />
      </div>
      <div className="card-body d-flex flex-column p-4">
        <div className="d-flex justify-content-between align-items-start mb-3">
          {isOutOfStock ? (
            <span className="badge bg-danger px-2.5 py-1.5 fs-7">Out of Stock</span>
          ) : isLowStock ? (
            <span className="badge bg-warning text-dark px-2.5 py-1.5 fs-7">Low Stock: {vehicle.quantity} left</span>
          ) : (
            <span className="badge bg-success px-2.5 py-1.5 fs-7">In Stock: {vehicle.quantity}</span>
          )}
        </div>

        <h3 className="fw-bold mb-4" style={{ color: 'var(--bs-primary)' }}>{formatPrice(vehicle.price)}</h3>

        <div className="mt-auto d-flex gap-2">
          <Link className="btn btn-outline-light btn-sm flex-fill d-flex align-items-center justify-content-center gap-1 py-2" to={`/vehicles/${vehicle.id}`}>
            <Eye size={16} /> View
          </Link>
          <button
            className="btn btn-primary btn-sm flex-fill d-flex align-items-center justify-content-center gap-1 py-2"
            onClick={() => onPurchase(vehicle)}
            disabled={isOutOfStock}
          >
            <ShoppingCart size={16} /> Purchase
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
