import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';
import ToastNotification from '../components/ToastNotification';
import ErrorMessage from '../components/ErrorMessage';
import { Shield } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await authService.login(email, password);
      const { token, user } = data.data;

      // Verify the user has administrative privileges
      if (user.role !== 'ROLE_ADMIN') {
        setError('Access denied. This login console is restricted to administrators.');
        setLoading(false);
        return;
      }

      login(token, user);
      setToastMessage('Authentication successful!');
      setTimeout(() => {
        navigate('/admin');
      }, 1000);
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Invalid credentials, please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      {toastMessage && (
        <ToastNotification message={toastMessage} type="success" onClose={() => setToastMessage('')} />
      )}
      <div className="auth-shell">
        <div className="auth-hero admin-hero">
          <span className="brand-pill admin-pill bg-danger-subtle text-danger border border-danger-subtle">
            Secure Access Control
          </span>
          <h1 className="text-white mt-3">Administrator Management Console</h1>
          <p className="text-muted">
            Oversee general dealership system operations. Configure fleet inventory lists, restock quantities, adjust specifications, and manage transaction statuses.
          </p>
        </div>

        <div className="card auth-card border border-secondary border-opacity-25 shadow-lg bg-dark text-white">
          <div className="card-body p-4">
            <div className="text-center mb-4">
              <div className="brand-mark mb-3 bg-danger bg-opacity-25 border border-danger text-danger" style={{ margin: '0 auto' }}>
                <Shield size={24} />
              </div>
              <h3 className="fw-bold">Admin Console Login</h3>
              <p className="text-muted small mb-0">Authorized personnel access only</p>
            </div>

            <ErrorMessage message={error} />

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted">Admin Email</label>
                <input
                  type="email"
                  className="form-control form-control-lg bg-dark text-white border border-secondary"
                  placeholder="admin@dealership.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold text-muted">Security Password</label>
                <input
                  type="password"
                  className="form-control form-control-lg bg-dark text-white border border-secondary"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-danger btn-lg w-100 d-flex align-items-center justify-content-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ) : (
                  'Authorize Console'
                )}
              </button>
            </form>

            <div className="text-center mt-4">
              <span className="text-muted small">Standard User? </span>
              <Link to="/login" className="small fw-semibold text-decoration-none text-danger">Go to Buyer Login</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
