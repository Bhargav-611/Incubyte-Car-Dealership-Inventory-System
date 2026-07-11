import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';
import ToastNotification from '../components/ToastNotification';
import ErrorMessage from '../components/ErrorMessage';
import { LogIn } from 'lucide-react';

const Login = () => {
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
      login(token, user);
      setToastMessage('Login successful!');
      setTimeout(() => {
        navigate('/dashboard');
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
        <div className="auth-hero">
          <span className="brand-pill">Immersive inventory experience</span>
          <h1>Step into a showroom built for modern buyers.</h1>
          <p>Discover premium vehicles, track availability instantly, and manage the flow of your dealership with a polished digital experience.</p>
        </div>

        <div className="card auth-card">
          <div className="card-body">
            <div className="text-center mb-4">
              <div className="brand-mark mb-3" style={{ margin: '0 auto' }}>
                <LogIn size={24} />
              </div>
              <h3 className="fw-bold">Welcome Back</h3>
              <p className="text-muted small mb-0">Log in to manage your inventory dashboard</p>
            </div>

            <ErrorMessage message={error} />

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Email Address</label>
                <input
                  type="email"
                  className="form-control form-control-lg"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold">Password</label>
                <input
                  type="password"
                  className="form-control form-control-lg"
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
                  'Log In'
                )}
              </button>
            </form>

            <div className="text-center mt-4">
              <span className="text-muted small">Don't have an account? </span>
              <Link to="/register" className="small fw-semibold text-decoration-none">Register here</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
