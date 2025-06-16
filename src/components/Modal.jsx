import React from "react";
import PropTypes from "prop-types";
import { FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaInfoCircle } from "react-icons/fa";
import "../styles/modal.scss";

const icons = {
  success: <FaCheckCircle className="icon success" />,
  error: <FaTimesCircle className="icon error" />,
  warning: <FaExclamationTriangle className="icon warning" />,
  info: <FaInfoCircle className="icon info" />,
};

const Modal = ({ isOpen, onClose, title, message, type, actionLabel, onAction }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className={`modal-content ${type}`} role="dialog" aria-modal="true">
        <div className="modal-header">
          {icons[type]}
          {title && <h2>{title}</h2>}
        </div>
        {message && <p className="modal-body">{message}</p>}
        <div className="modal-footer">
          {onAction && <button onClick={onAction}>{actionLabel || "Aceptar"}</button>}
          <button onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  type: PropTypes.oneOf(["success", "error", "warning", "info"]),
  actionLabel: PropTypes.string,
  onAction: PropTypes.func,
};

Modal.defaultProps = {
  type: "info",
};

export default Modal;
