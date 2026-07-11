import React from 'react';
import VehicleCard from './VehicleCard';

export const VehicleGrid = ({ vehicles, onPurchase }) => {
  return (
    <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4 mb-4">
      {vehicles.map((vehicle) => (
        <div className="col" key={vehicle.id}>
          <VehicleCard vehicle={vehicle} onPurchase={onPurchase} />
        </div>
      ))}
    </div>
  );
};

export default VehicleGrid;
