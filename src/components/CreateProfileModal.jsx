import React, { useState } from "react";
import Img from "../constants/images"; // Lista de imágenes
import Modal from "./Modal";
import "../styles/createProfileModal.scss";

const CreateProfileModal = ({ smartCards, profiles, onClose, onCreateProfile }) => {
  const [newProfileName, setNewProfileName] = useState("");
  const [selectedImage, setSelectedImage] = useState(Img[0]?.id || null);

  // Estado del modal de mensajes
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");

  // Función para mostrar el modal con mensajes
  const showModal = (message, type = "error") => {
    setModalMessage(message);
    setModalType(type);
    setModalOpen(true);
  };

  const handleCreateProfile = () => {
    if (!newProfileName.trim()) {
      showModal("El nombre del perfil no puede estar vacío.");
      return;
    }

    if (!selectedImage) {
      showModal("Debe seleccionar una imagen.");
      return;
    }

    // Validar si hay tarjetas disponibles
    const availableSmartCard = smartCards.find(
      (card) => !profiles.some((profile) => profile.sn === card.key)
    );

    if (!availableSmartCard) {
      showModal("No hay tarjetas inteligentes disponibles para crear un nuevo perfil.");
      return;
    }
    console.log(availableSmartCard);

    // Crear perfil con la tarjeta inteligente disponible
    onCreateProfile({
      name: newProfileName,
      imageId: selectedImage,
      license: availableSmartCard.key,
      pin: availableSmartCard.pin,
    });

    // Limpiar el formulario y cerrar el modal
    setNewProfileName("");
    setSelectedImage(Img[0]?.id || null);
    showModal("Perfil creado exitosamente.", "success");

    setTimeout(() => {
      onClose();
    }, 2000); // Cierra el modal después de 2 segundos
  };

  return (
    <div className="create-profile-modal">
      <div className="modal-content">
        <h2>Crear Nuevo Perfil</h2>
        <div className="form">
          <label htmlFor="profileName">Nombre del Perfil</label>
          <input
            type="text"
            id="profileName"
            placeholder="Nombre del perfil"
            value={newProfileName}
            onChange={(e) => setNewProfileName(e.target.value)}
          />
          <div className="image-selector">
            <h3>Selecciona una Imagen</h3>
            <div className="image-list">
              {Img.map((img) => (
                <img
                  key={img.id}
                  src={img.img}
                  alt={`Imagen ${img.id}`}
                  onClick={() => setSelectedImage(img.id)}
                  className={selectedImage === img.id ? "selected" : ""}
                />
              ))}
            </div>
          </div>
          <button className="create-button" onClick={handleCreateProfile}>
            Crear Perfil
          </button>
          <button className="close-button" onClick={onClose}>
          Cerrar
        </button>
        </div>
      </div>
      {/* Modal de mensajes */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalType === "success" ? "Éxito" : "Error"}
        message={modalMessage}
        type={modalType}
      />
    </div>
  );
};

export default CreateProfileModal;
