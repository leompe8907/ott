import React from "react";
import PropTypes from "prop-types";
import "../styles/modal.scss"; // Asegúrate de tener estilos adecuados para el modal

const Modal = ({ isOpen, onClose, title, message, type }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className={`modal-content ${type}`}>
        {title && <h2>{title}</h2>}
        {message && <p>{message}</p>}
        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  type: PropTypes.oneOf(["success", "error"]), // Permite identificar si el mensaje es de éxito o error
};

Modal.defaultProps = {
  title: "",
  message: "",
  type: "success",
};

export default Modal;
