import React, { useState, useEffect, useCallback } from 'react';
import { vehicleService } from '../services/vehicleService';
import VehicleGrid from '../components/VehicleGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import FilterPanel from '../components/FilterPanel';
import Pagination from '../components/Pagination';
import ConfirmationModal from '../components/ConfirmationModal';
import ToastNotification from '../components/ToastNotification';

const Dashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  
  const [page, setPage] = useState(0);
  const [size] = useState(6);
  const [sortBy, setSortBy] = useState('price');
  const [sortDir, setSortDir] = useState('asc');
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        page,
        size,
        sortBy,
        sortDir,
      };
      
      if (make) params.make = make;
      if (model) params.model = model;
      if (category) params.category = category;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;

      let data;
      if (make || model || category || minPrice || maxPrice) {
        data = await vehicleService.search(params);
      } else {
        data = await vehicleService.getAll(page, size, sortBy, sortDir);
      }
      
      if (data && data.success) {
        setVehicles(data.data.content);
        setTotalPages(data.data.totalPages);
        setTotalElements(data.data.totalElements);
      } else {
        setError(data.message || 'Failed to fetch inventory');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error communicating with database server.');
    } finally {
      setLoading(false);
    }
  }, [page, size, sortBy, sortDir, make, model, category, minPrice, maxPrice]);

  useEffect(() => {
    fetchVehicles();
  }, [page, sortBy, sortDir]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    fetchVehicles();
  };

  const handleReset = () => {
    setMake('');
    setModel('');
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    setPage(0);
    setSortBy('price');
    setSortDir('asc');
    setTimeout(() => {
      fetchVehicles();
    }, 0);
  };

  const triggerConfirmPurchase = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowConfirm(true);
  };

  const handleConfirmPurchase = async () => {
    if (!selectedVehicle) return;
    setShowConfirm(false);
    
    try {
      const data = await vehicleService.purchase(selectedVehicle.id, 1);
      if (data && data.success) {
        setToastMessage(`Successfully purchased a ${selectedVehicle.make} ${selectedVehicle.model}!`);
        setToastType('success');
        fetchVehicles();
      } else {
        setToastMessage(data.message || 'Purchase transaction failed');
        setToastType('error');
      }
    } catch (err) {
      setToastMessage(err.response?.data?.message || 'Purchase transaction failed');
      setToastType('error');
    } finally {
      setSelectedVehicle(null);
    }
  };

  return (
    <div className="container py-3">
      {toastMessage && (
        <ToastNotification message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />
      )}

      <ConfirmationModal
        show={showConfirm}
        title="Confirm Purchase"
        message={`Are you sure you want to purchase 1 unit of ${selectedVehicle?.make} ${selectedVehicle?.model} for ${selectedVehicle ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(selectedVehicle.price) : ''}?`}
        onConfirm={handleConfirmPurchase}
        onCancel={() => {
          setShowConfirm(false);
          setSelectedVehicle(null);
        }}
        confirmText="Confirm Order"
        type="success"
      />

      <div className="card dashboard-hero">
        <div className="dashboard-hero__content">
          <span className="brand-pill">Live inventory</span>
          <h2 className="fw-bold mb-1">Your next performance machine is waiting.</h2>
          <p>Browse a hand-picked lineup of premium vehicles with instant pricing and availability insights.</p>
        </div>
        <div className="dashboard-stat">
          <div>
            <strong>{totalElements}</strong>
            <span className="text-muted small">matching vehicles</span>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-3 mb-4">
          <FilterPanel
            make={make} setMake={setMake}
            model={model} setModel={setModel}
            category={category} setCategory={setCategory}
            minPrice={minPrice} setMinPrice={setMinPrice}
            maxPrice={maxPrice} setMaxPrice={setMaxPrice}
            onSearch={handleSearch}
            onReset={handleReset}
          />
        </div>

        <div className="col-lg-9">
          <div className="card p-4 mb-4" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
              <div>
                <h4 className="fw-bold mb-1">Available Vehicles</h4>
                <p className="text-muted mb-0 small">Showing {totalElements} matching cars</p>
              </div>

              <div className="d-flex align-items-center gap-2">
                <span className="text-muted small fw-semibold text-nowrap">Sort By</span>
                <select className="form-select form-select-sm" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="price">Price</option>
                  <option value="make">Make</option>
                  <option value="model">Model</option>
                </select>
                <select className="form-select form-select-sm" value={sortDir} onChange={(e) => setSortDir(e.target.value)}>
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </div>
          </div>

          <ErrorMessage message={error} />

          {loading ? (
            <LoadingSpinner />
          ) : vehicles.length === 0 ? (
            <EmptyState onReset={handleReset} />
          ) : (
            <>
              <VehicleGrid vehicles={vehicles} onPurchase={triggerConfirmPurchase} />
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
