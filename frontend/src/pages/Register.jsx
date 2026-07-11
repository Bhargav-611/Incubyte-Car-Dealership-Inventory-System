import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import ToastNotification from '../components/ToastNotification';
import ErrorMessage from '../components/ErrorMessage';
import { UserPlus } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!strongPasswordRegex.test(password)) {
      setError('Password must be at least 8 characters long, contain uppercase, lowercase, numbers, and a special character.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await authService.register(name, email, password);
      setSuccessMessage('Registration successful! Redirecting to login page...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.errors) {
        setError(err.response.data.errors.join(', '));
      } else {
        setError('Network error, please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      {successMessage && (
        <ToastNotification message={successMessage} type="success" onClose={() => setSuccessMessage('')} />
      )}
      <div className="auth-shell">
        <div className="auth-hero">
          <span className="brand-pill">Curated showroom access</span>
          <h1>Open your account and explore the fleet.</h1>
          <p>Create a profile to browse inventory, reserve your next vehicle, and navigate the dealership experience with confidence.</p>
        </div>

        <div className="card auth-card">
          <div className="card-body">
            <div className="text-center mb-4">
              <div className="brand-mark mb-3" style={{ margin: '0 auto' }}>
                <UserPlus size={24} />
              </div>
              <h3 className="fw-bold">Create Account</h3>
              <p className="text-muted small mb-0">Register to browse and purchase vehicles</p>
            </div>

            <ErrorMessage message={error} />

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="john.doe@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg w-100 d-flex align-items-center justify-content-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ) : (
                  'Register'
                )}
              </button>
            </form>

            <div className="text-center mt-4">
              <span className="text-muted small">Already have an account? </span>
              <Link to="/login" className="small fw-semibold text-decoration-none">Log in here</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
