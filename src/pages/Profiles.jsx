import React, { useState, useEffect } from "react";
import BackendService from "../services/backendService";
import Img from "../constants/images"; // Lista de imágenes
import Modal from "../components/Modal"; // Importar el componente modal
import "../styles/profile.scss";

const Profiles = () => {
  const [smartCards, setSmartCards] = useState([]); // Información de las tarjetas inteligentes
  const [profiles, setProfiles] = useState([]); // Lista de perfiles
  const [loading, setLoading] = useState(false);

  const [newProfileName, setNewProfileName] = useState(""); // Nombre del nuevo perfil
  const [selectedImage, setSelectedImage] = useState(Img[0].id); // Imagen seleccionada

  // Estado para el modal de mensajes
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");

  // Mostrar modal con mensaje
  const showModal = (message, type = "success") => {
    setModalMessage(message);
    setModalType(type);
    setModalOpen(true);
  };


  // Obtener lista de perfiles
  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const response = await BackendService.callAuthenticatedApi("getClientConfig");
      if (response && response.profiles) {
        setProfiles(response.profiles);
      } else {
        showModal("No se encontraron perfiles disponibles.", "error");
      }
    } catch (err) {
      showModal(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // Obtener tarjetas inteligentes y filtrar por licencias con productos asociados
  const fetchSmartCards = async () => {
    try {
      setLoading(true);
      const response = await BackendService.callAuthenticatedApi("getStreamingLicenses", {
        withPins: true,
      });
      if (response) {
        // Filtrar solo las licencias que tienen un producto asociado
        const validLicenses = response.filter((license) => license.products && license.products.trim() !== "");

        if (validLicenses.length === 0) {
          showModal("No hay licencias con productos asociados disponibles.", "error");
        }
  
        setSmartCards(validLicenses);
      } else {
        showModal("No se encontraron tarjetas inteligentes.", "error");
      }
    } catch (err) {
      showModal(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // Crear perfil
  const createProfile = async () => {
    if (!newProfileName.trim()) {
      showModal("El nombre del perfil no puede estar vacío.", "error");
      return;
    }

    try {
      setLoading(true);

      // Validar si hay tarjetas inteligentes disponibles
      const availableCards = smartCards.filter(
        (card) => !profiles.some((profile) => profile.sn === card.key)
      );
      if (availableCards.length === 0) {
        showModal("No hay tarjetas inteligentes disponibles para crear un nuevo perfil.", "error");
        return;
      }

      const selectedCard = availableCards[0];

      // Crear el perfil en el backend
      await BackendService.callAuthenticatedApi("createProfile", {
        name: newProfileName,
        assignNewLicense: false,
        license: selectedCard.key,
        pin: selectedCard.pin,
        imageId: selectedImage,
      });

      // Actualizar perfiles y tarjetas
      fetchProfiles();
      fetchSmartCards();
      setNewProfileName("");
      setSelectedImage(Img[0].id);
      showModal("Perfil creado exitosamente.", "success");
    } catch (err) {
      showModal(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // Eliminar perfil
  const deleteProfile = async (profileId) => {
    if (showModal("¿Estás seguro de que deseas eliminar este perfil?")) {
      return;
    }

    try {
      setLoading(true);

      await BackendService.callAuthenticatedApi("deleteProfile", { profileId });
      fetchProfiles();
      showModal("Perfil eliminado exitosamente.", "success");
    } catch (err) {
      showModal(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // Activar perfil
  const activateProfile = async (profileId) => {
    try {
      setLoading(true);

      await BackendService.callAuthenticatedApi("setActiveProfile", { 
        profileId,
        deviceName:"Web"
      });
      showModal("Perfil activado correctamente.", "success");
    } catch (err) {
      showModal(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
    fetchSmartCards();
  }, []);

  return (
    <div className="profiles-container">
      <h1>Gestión de Perfiles</h1>
      {loading && <p>Cargando...</p>}

      <div className="profiles-list">
        {profiles.length > 0 ? (
          profiles.map((profile) => (
            <div key={profile.id} className="profile-card">
              <p>{profile.name}</p>
              <img
                src={`https://cv01.panaccess.com/cv_data_pub/images/${profile.imageId}/v/thumb.png`}
                alt={`Imagen de ${profile.name}`}
              />
              <button onClick={() => activateProfile(profile.id)} className="btn-activate">
                Activar
              </button>
              <button onClick={() => deleteProfile(profile.id)} className="btn-delete">
                Eliminar
              </button>
            </div>
          ))
        ) : (
          <p>No hay perfiles disponibles.</p>
        )}
      </div>

      <div className="create-profile-form">
        <h2>Crear Nuevo Perfil</h2>
        <input
          type="text"
          placeholder="Nombre del perfil"
          value={newProfileName}
          onChange={(e) => setNewProfileName(e.target.value)}
        />

        <div className="image-selector">
          <h3>Selecciona una imagen</h3>
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

        <button onClick={createProfile} disabled={loading}>
          {loading ? "Creando..." : "Crear Perfil"}
        </button>
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

export default Profiles;
