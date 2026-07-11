import React from 'react';

const ConfirmationDialog = ({ show, title, message, onConfirm, onCancel, confirmText = "Confirm", cancelText = "Cancel", type = "primary" }) => {
  if (!show) return null;

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow-lg border-0">
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-bold">{title}</h5>
            <button type="button" className="btn-close" onClick={onCancel} aria-label="Close"></button>
          </div>
          <div className="modal-body py-3">
            <p className="mb-0 text-secondary">{message}</p>
          </div>
          <div className="modal-footer border-0 pt-0">
            <button type="button" className="btn btn-light" onClick={onCancel}>{cancelText}</button>
            <button type="button" className={`btn btn-${type}`} onClick={onConfirm}>{confirmText}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
