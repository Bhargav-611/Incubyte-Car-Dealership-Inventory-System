import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { vehicleService } from '../services/vehicleService';
import VehicleTable from '../components/VehicleTable';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import ConfirmationModal from '../components/ConfirmationModal';
import ToastNotification from '../components/ToastNotification';
import { Plus, ShieldAlert } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [restockingVehicle, setRestockingVehicle] = useState(null);
  const [restockAmount, setRestockAmount] = useState('');
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingVehicle, setDeletingVehicle] = useState(null);

  const [formError, setFormError] = useState('');
  const [formSaving, setFormSaving] = useState(false);

  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const fetchVehicles = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await vehicleService.getAll(0, 100, 'id', 'asc');
      if (response && response.success) {
        setVehicles(response.data.content);
      } else {
        setError(response.message || 'Failed to fetch inventory');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error communicating with database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleEdit = (vehicle) => {
    navigate(`/admin/edit-vehicle/${vehicle.id}`);
  };

  const handleRestockClick = (vehicle) => {
    setRestockingVehicle(vehicle);
    setRestockAmount('');
    setFormError('');
    setShowRestockModal(true);
  };

  const handleRestockSubmit = async (e) => {
    e.preventDefault();
    if (!restockAmount || Number(restockAmount) <= 0) {
      setFormError('Quantity must be at least 1');
      return;
    }

    setFormSaving(true);
    setFormError('');

    try {
      const data = await vehicleService.restock(restockingVehicle.id, Number(restockAmount));
      if (data && data.success) {
        setToastMessage(`Restocked ${restockingVehicle.make} ${restockingVehicle.model} successfully!`);
        setToastType('success');
        setShowRestockModal(false);
        fetchVehicles();
      } else {
        setFormError(data.message || 'Restock action failed');
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Restock failed');
    } finally {
      setFormSaving(false);
      setRestockingVehicle(null);
    }
  };

  const handleDeleteClick = (vehicle) => {
    setDeletingVehicle(vehicle);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingVehicle) return;
    setShowDeleteConfirm(false);

    try {
      const data = await vehicleService.delete(deletingVehicle.id);
      if (data && data.success) {
        setToastMessage('Vehicle listing deleted successfully!');
        setToastType('success');
        fetchVehicles();
      } else {
        setToastMessage(data.message || 'Delete operation failed');
        setToastType('error');
      }
    } catch (err) {
      setToastMessage(err.response?.data?.message || 'Delete operation failed');
      setToastType('error');
    } finally {
      setDeletingVehicle(null);
    }
  };

  return (
    <div className="container py-3">
      {toastMessage && (
        <ToastNotification message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />
      )}

      <ConfirmationModal
        show={showDeleteConfirm}
        title="Delete Vehicle"
        message={`Are you sure you want to permanently delete the ${deletingVehicle?.make} ${deletingVehicle?.model} from inventory?`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setDeletingVehicle(null);
        }}
        confirmText="Delete"
        type="danger"
      />

      {showRestockModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Restock Vehicle</h5>
                <button type="button" className="btn-close" onClick={() => setShowRestockModal(false)}></button>
              </div>
              <form onSubmit={handleRestockSubmit}>
                <div className="modal-body">
                  {formError && <div className="alert alert-danger py-2 small">{formError}</div>}
                  <p className="text-secondary small mb-3">
                    Increase stock for <strong>{restockingVehicle?.make} {restockingVehicle?.model}</strong>.
                  </p>
                  <div className="mb-3">
                    <label className="form-label text-secondary small fw-semibold">Quantity to Add</label>
                    <input
                      type="number"
                      className="form-control form-control-lg text-center"
                      value={restockAmount}
                      onChange={(e) => setRestockAmount(e.target.value)}
                      placeholder="e.g. 5"
                      required
                      autoFocus
                    />
                  </div>
                </div>
                <div className="modal-footer border-0">
                  <button type="button" className="btn btn-light" onClick={() => setShowRestockModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-success" disabled={formSaving}>
                    {formSaving ? 'Updating...' : 'Restock'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4 card shadow-sm border-0 p-4">
        <div className="d-flex align-items-center gap-2">
          <ShieldAlert size={28} className="text-danger" />
          <div>
            <h4 className="fw-bold text-dark mb-0">Admin Inventory Panel</h4>
            <p className="text-secondary small mb-0">Authorized operations: Create, Update, Delete, and Restock vehicles.</p>
          </div>
        </div>
        <button className="btn btn-primary d-flex align-items-center gap-1.5 py-2 px-3 fw-semibold" onClick={() => navigate('/admin/add-vehicle')}>
          <Plus size={18} /> Add Vehicle
        </button>
      </div>

      <ErrorMessage message={error} />

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="card shadow-sm border-0 p-4 bg-white">
          <VehicleTable
            vehicles={vehicles}
            onRestock={handleRestockClick}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
