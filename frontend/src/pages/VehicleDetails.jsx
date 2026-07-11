import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { vehicleService } from '../services/vehicleService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import ConfirmationModal from '../components/ConfirmationModal';
import ToastNotification from '../components/ToastNotification';
import { ChevronLeft, ShoppingCart, Calendar } from 'lucide-react';
import { formatPrice } from '../utils';

const VehicleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [showConfirm, setShowConfirm] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await vehicleService.getById(id);
        if (data && data.success) {
          setVehicle(data.data);
        } else {
          setError(data.message || 'Failed to fetch details');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Error communicating with database server.');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleDetails();
  }, [id]);

  const handlePurchase = async () => {
    setShowConfirm(false);
    try {
      const data = await vehicleService.purchase(id, 1);
      if (data && data.success) {
        setToastMessage('Purchase successful!');
        setToastType('success');
        setVehicle(data.data);
      } else {
        setToastMessage(data.message || 'Purchase failed');
        setToastType('error');
      }
    } catch (err) {
      setToastMessage(err.response?.data?.message || 'Purchase failed');
      setToastType('error');
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="container py-5 text-center">
        <ErrorMessage message={error} />
        <Link to="/" className="btn btn-primary mt-3">Back to Dashboard</Link>
      </div>
    );
  }

  if (!vehicle) return null;

  const isOutOfStock = vehicle.quantity === 0;

  return (
    <div className="container py-4">
      {toastMessage && (
        <ToastNotification message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />
      )}

      <ConfirmationModal
        show={showConfirm}
        title="Confirm Purchase"
        message={`Are you sure you want to purchase a ${vehicle.make} ${vehicle.model} for ${formatPrice(vehicle.price)}?`}
        onConfirm={handlePurchase}
        onCancel={() => setShowConfirm(false)}
        confirmText="Confirm Order"
        type="success"
      />

      <button className="btn btn-link text-decoration-none text-secondary d-flex align-items-center gap-1 mb-4 p-0" onClick={() => navigate(-1)}>
        <ChevronLeft size={20} /> Back
      </button>

      <div className="row g-5">
        <div className="col-md-6">
          <div className="bg-light rounded-4 p-5 d-flex justify-content-center align-items-center" style={{ minHeight: '350px' }}>
            <span className="text-secondary opacity-25 font-monospace fs-1 fw-bold">{vehicle.category.toUpperCase()}</span>
          </div>
        </div>

        <div className="col-md-6 d-flex flex-column justify-content-center">
          <span className="badge bg-primary text-uppercase px-2.5 py-1.5 fs-7 align-self-start mb-3">{vehicle.category}</span>
          
          <h1 className="display-5 fw-bold text-dark mb-2">{vehicle.make}</h1>
          <h2 className="text-secondary fw-normal mb-3">{vehicle.model}</h2>
          
          <h2 className="text-primary fw-bold mb-4">{formatPrice(vehicle.price)}</h2>
          
          <div className="border-top border-bottom border-light py-3 mb-4">
            <div className="row">
              <div className="col-6 mb-2">
                <span className="text-muted small d-block">Inventory ID</span>
                <span className="fw-semibold font-monospace">{vehicle.id}</span>
              </div>
              <div className="col-6 mb-2">
                <span className="text-muted small d-block">Stock Available</span>
                <span className={`fw-bold ${isOutOfStock ? 'text-danger' : 'text-success'}`}>
                  {isOutOfStock ? 'Out of Stock' : `${vehicle.quantity} Units`}
                </span>
              </div>
              {vehicle.createdAt && (
                <div className="col-12 mt-2 d-flex align-items-center gap-1.5 text-muted small">
                  <Calendar size={14} /> Listed on {new Date(vehicle.createdAt).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>

          <button 
            className="btn btn-primary btn-lg d-flex align-items-center justify-content-center gap-2 py-3" 
            onClick={() => setShowConfirm(true)}
            disabled={isOutOfStock}
          >
            <ShoppingCart size={20} /> Purchase Vehicle
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;
