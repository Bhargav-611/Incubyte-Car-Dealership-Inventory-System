import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogOut, Car, ShieldAlert, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-glass py-3 mb-4">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <span className="brand-mark">
            <Car size={20} />
          </span>
          <span className="fw-bold tracking-tight">Apex Motors</span>
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {user && (
              <>
                <li className="nav-item">
                  <Link className="nav-link d-flex align-items-center gap-1" to="/dashboard">
                    <LayoutDashboard size={18} /> Dashboard
                  </Link>
                </li>
                {isAdmin() && (
                  <li className="nav-item">
                    <Link className="nav-link d-flex align-items-center gap-1" to="/admin">
                      <ShieldAlert size={18} /> Admin Panel
                    </Link>
                  </li>
                )}
              </>
            )}
          </ul>

          <div className="navbar-nav align-items-center gap-3">
            {user ? (
              <>
                <span className="text-white-50 fs-6">
                  Hello, <strong className="text-white">{user.name}</strong>
                  <span className="brand-pill ms-2">{user.role.replace('ROLE_', '')}</span>
                </span>
                <button className="btn btn-outline-light btn-sm d-flex align-items-center gap-1" onClick={handleLogout}>
                  <LogOut size={16} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link className="btn btn-outline-light btn-sm px-3" to="/login">Login</Link>
                <Link className="btn btn-primary btn-sm px-3" to="/register">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
