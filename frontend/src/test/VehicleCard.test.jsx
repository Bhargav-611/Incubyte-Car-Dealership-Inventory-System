import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import VehicleCard from '../components/VehicleCard';

describe('VehicleCard Component', () => {
  const mockVehicle = {
    id: 1,
    make: 'Honda',
    model: 'Civic',
    category: 'Sedan',
    price: 24000,
    quantity: 5,
  };

  const mockOutOfStockVehicle = {
    ...mockVehicle,
    quantity: 0,
  };

  const renderComponent = (vehicle, onPurchase = vi.fn()) => {
    return render(
      <BrowserRouter>
        <VehicleCard vehicle={vehicle} onPurchase={onPurchase} />
      </BrowserRouter>
    );
  };

  it('renders vehicle information correctly', () => {
    renderComponent(mockVehicle);
    expect(screen.getByText('Honda')).toBeInTheDocument();
    expect(screen.getByText('Civic')).toBeInTheDocument();
    expect(screen.getByText('Sedan')).toBeInTheDocument();
    expect(screen.getByText('$24,000.00')).toBeInTheDocument();
    expect(screen.getByText('In Stock: 5')).toBeInTheDocument();
  });

  it('disables purchase button when vehicle is out of stock', () => {
    renderComponent(mockOutOfStockVehicle);
    const purchaseBtn = screen.getByRole('button', { name: /purchase/i });
    expect(purchaseBtn).toBeDisabled();
    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
  });

  it('calls onPurchase when button is clicked', () => {
    const onPurchaseMock = vi.fn();
    renderComponent(mockVehicle, onPurchaseMock);
    const purchaseBtn = screen.getByRole('button', { name: /purchase/i });
    fireEvent.click(purchaseBtn);
    expect(onPurchaseMock).toHaveBeenCalledTimes(1);
    expect(onPurchaseMock).toHaveBeenCalledWith(mockVehicle);
  });
});
