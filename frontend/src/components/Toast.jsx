import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="text-success" size={20} />;
      case 'danger':
      case 'error':
        return <AlertCircle className="text-danger" size={20} />;
      default:
        return <Info className="text-info" size={20} />;
    }
  };

  return (
    <div className={`toast show align-items-center bg-white border-0 shadow position-fixed top-0 end-0 m-4 p-2`} role="alert" style={{ zIndex: 10000, minWidth: '280px' }}>
      <div className="d-flex align-items-center justify-content-between">
        <div className="toast-body d-flex align-items-center gap-2">
          {getIcon()}
          <span className="text-dark fw-medium">{message}</span>
        </div>
        <button type="button" className="btn-close me-2 m-auto" onClick={onClose}></button>
      </div>
    </div>
  );
};

export default Toast;
