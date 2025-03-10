import React from "react";
import "../styles/loading.scss"; // Estilos para la animación

const Loading = () => {
  return (
    <div className="loading-overlay">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );
};

export default Loading;