import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { vehicleService } from '../services/vehicleService';
import ErrorMessage from '../components/ErrorMessage';
import ToastNotification from '../components/ToastNotification';
import LoadingSpinner from '../components/LoadingSpinner';
import { CATEGORIES } from '../constants';
import { ChevronLeft } from 'lucide-react';

const EditVehicle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const fetchVehicle = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await vehicleService.getById(id);
        if (data && data.success) {
          const v = data.data;
          setMake(v.make);
          setModel(v.model);
          setCategory(v.category);
          setPrice(v.price);
          setQuantity(v.quantity);
        } else {
          setError(data.message || 'Failed to fetch details');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Error occurred while loading data');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!make || !model || !category || !price || quantity === '') {
      setError('All fields are required');
      return;
    }

    if (Number(price) <= 0) {
      setError('Price must be greater than zero');
      return;
    }

    if (Number(quantity) < 0) {
      setError('Quantity cannot be negative');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const payload = {
        make,
        model,
        category,
        price: Number(price),
        quantity: Number(quantity)
      };

      const data = await vehicleService.update(id, payload);
      if (data && data.success) {
        setToastMessage('Vehicle listing updated successfully!');
        setTimeout(() => {
          navigate('/admin');
        }, 1200);
      } else {
        setError(data.message || 'Failed to update vehicle');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error occurred while saving');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container py-3">
      {toastMessage && (
        <ToastNotification message={toastMessage} type="success" onClose={() => setToastMessage('')} />
      )}

      <button className="btn btn-link text-decoration-none text-secondary d-flex align-items-center gap-1 mb-4 p-0" onClick={() => navigate('/admin')}>
        <ChevronLeft size={20} /> Back to Panel
      </button>

      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-6">
          <div className="card shadow-sm border-0 p-4">
            <div className="card-body">
              <h4 className="fw-bold text-dark mb-4">Edit Vehicle Details</h4>
              
              <ErrorMessage message={error} />

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label text-secondary small fw-semibold">Make</label>
                  <input
                    type="text"
                    className="form-control"
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label text-secondary small fw-semibold">Model</label>
                  <input
                    type="text"
                    className="form-control"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label text-secondary small fw-semibold">Category</label>
                  <select
                    className="form-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  >
                    {CATEGORIES.map((cat) => (
                      <option value={cat} key={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label text-secondary small fw-semibold">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label text-secondary small fw-semibold">Stock Quantity</label>
                  <input
                    type="number"
                    className="form-control"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                  />
                </div>

                <div className="d-flex gap-2">
                  <button type="button" className="btn btn-outline-secondary w-100 py-2.5" onClick={() => navigate('/admin')}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary w-100 py-2.5" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditVehicle;
