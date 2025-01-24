import React from "react";
//import "../styles/smartcardinfo.scss";

const SmartCardInfo = ({ smartCards }) => {
  return (
    <div className="smartcard-info-container">
      <h2>Información de Tarjetas Inteligentes</h2>
      {smartCards.length > 0 ? (
        <div className="smartcard-list">
          {smartCards.map((card, index) => (
            <div key={index} className="smartcard-card">
              <p><strong>Serial:</strong> {card.key}</p>
              <p><strong>Licencia:</strong> {card.licenseName}</p>
              <p><strong>Estado:</strong> {card.active ? "Activa" : "Inactiva"}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No hay tarjetas inteligentes disponibles.</p>
      )}
    </div>
  );
};

export default SmartCardInfo;
