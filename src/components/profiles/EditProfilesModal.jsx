
import React from "react";
import "../../styles/editProfilesModal.scss";

const EditProfilesModal = ({ profiles, onClose, onDeleteProfile }) => {
  
  return (
    <div className="edit-profiles-modal">
      <div className="modal-content">
        <h2>Editar Perfiles</h2>
        <button className="close-button" onClick={onClose}>
          Cerrar
        </button>
        <div className="profiles-list">
          {profiles.length > 0 ? (
            profiles.map((profile) => (
              <div key={profile.id} className="profile-card">
                <p>{profile.name}</p>
                <img
                  src={`https://pmdw-1.in.tv.br/cv_data_pub/images/${profile.imageId}/v/thumb.png`}
                  alt={`Imagen de ${profile.name}`}
                />
                <button
                  onClick={() => onDeleteProfile(profile.id)}
                  className="delete-button"
                >
                  Eliminar
                </button>
              </div>
            ))
          ) : (
            <p>No hay perfiles disponibles.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditProfilesModal;
