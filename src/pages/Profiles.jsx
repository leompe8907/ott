import React, { useState, useEffect } from "react";
import BackendService from "../services/backendService";
import Img from "../constants/images"; // Lista de imágenes
import "../styles/profile.scss";

const Profiles = () => {
  const [smartCards, setSmartCards] = useState([]); // Información de las tarjetas inteligentes
  const [profiles, setProfiles] = useState([]); // Lista de perfiles
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newProfileName, setNewProfileName] = useState(""); // Nombre del nuevo perfil
  const [selectedImage, setSelectedImage] = useState(Img[0].id); // Imagen seleccionada

  // Fetch perfiles
  const fetchProfiles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await BackendService.callAuthenticatedApi("getClientConfig");
      if (response && response.profiles) {
        setProfiles(response.profiles);
      } else {
        setError("No se encontraron perfiles disponibles.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch tarjetas inteligentes
  const fetchSmartCards = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await BackendService.callAuthenticatedApi("getStreamingLicenses", {
        withPins: true,
      });
      if (response) {
        setSmartCards(response);
      } else {
        setError("No se encontraron tarjetas inteligentes.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Crear perfil
  const createProfile = async () => {
    if (!newProfileName.trim()) {
      setError("El nombre del perfil no puede estar vacío.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Validar si hay tarjetas inteligentes disponibles
      const availableCards = smartCards.filter(
        (card) => !profiles.some((profile) => profile.sn === card.key)
      );
      if (availableCards.length === 0) {
        setError("No hay tarjetas inteligentes disponibles para crear un nuevo perfil.");
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
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar perfil
  const deleteProfile = async (profileId) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este perfil?")) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await BackendService.callAuthenticatedApi("deleteProfile", { profileId });
      fetchProfiles();
      alert("Perfil eliminado exitosamente.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Activar perfil
  const activateProfile = async (profileId) => {
    try {
      setLoading(true);
      setError(null);

      await BackendService.callAuthenticatedApi("setActiveProfile", { 
        profileId,
        deviceName:"Web"
       });
      alert("Perfil activado correctamente.");
    } catch (err) {
      setError(err.message);
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
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="profiles-list">
        {profiles.length > 0 ? (
          profiles.map((profile) => (
            <div key={profile.id} className="profile-card">
              <p>{profile.name}</p>
              <img
                src={`https://cv01.panaccess.com/cv_data_pub/images/${profile.imageId}/v/thumb.png`}
                alt={`Imagen de ${profile.name}`}
              />
              <button
                onClick={() => activateProfile(profile.id)}
                style={{
                  backgroundColor: "blue",
                  color: "white",
                  border: "none",
                  padding: "5px 10px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  margin: "5px",
                }}
              >
                Activar
              </button>
              <button
                onClick={() => deleteProfile(profile.id)}
                style={{
                  backgroundColor: "red",
                  color: "white",
                  border: "none",
                  padding: "5px 10px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
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

      <div className="smart-card-info">
        <h2>Información de Tarjetas Inteligentes</h2>
        {smartCards.length > 0 ? (
          smartCards.map((card, index) => (
            <div key={index}>
              <p>Serial: {card.key}</p>
              <p>Licencia: {card.licenseName}</p>
            </div>
          ))
        ) : (
          <p>No hay tarjetas disponibles.</p>
        )}
      </div>
    </div>
  );
};

export default Profiles;
