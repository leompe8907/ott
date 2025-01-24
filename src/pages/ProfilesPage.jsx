import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CreateProfileModal from "../components/CreateProfileModal";
import EditProfilesModal from "../components/EditProfilesModal";
import ProfilesList from "../components/ProfilesList";
import BackendService from "../services/backendService";
import "../styles/profilesPage.scss";

const ProfilesPage = () => {
  const [profiles, setProfiles] = useState([]);
  const [smartCards, setSmartCards] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Fetch profiles and smart cards from the backend
  const fetchProfilesAndSmartCards = async () => {
    setLoading(true);
    try {
      const profileResponse = await BackendService.callAuthenticatedApi("getClientConfig");
      const smartCardResponse = await BackendService.callAuthenticatedApi("getStreamingLicenses", {
        withPins: true,
      });

      setProfiles(profileResponse?.profiles || []);
      setSmartCards(smartCardResponse || []);
    } catch (err) {
      console.error("Error al obtener perfiles o tarjetas inteligentes:", err);
      setError("Hubo un problema al cargar los datos. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProfile = async (profileId) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este perfil?")) {
      return;
    }
  
    try {
      await BackendService.callAuthenticatedApi("deleteProfile", { profileId });
      alert("Perfil eliminado exitosamente.");
      fetchProfilesAndSmartCards(); // Refrescar perfiles después de eliminar
    } catch (err) {
      console.error("Error al eliminar perfil:", err);
      setError("Hubo un error al eliminar el perfil. Intenta nuevamente.");
    }
  };

  const handleCreateProfile = async (newProfile) => {
    try {
      setLoading(true);
      await BackendService.callAuthenticatedApi("createProfile", newProfile);
      fetchProfilesAndSmartCards(); // Actualizar la lista de perfiles
      setShowCreateModal(false); // Cerrar el modal
    } catch (err) {
      console.error("Error al crear perfil:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchProfilesAndSmartCards();
  }, []);

  // Handle modal visibility
  const handleShowCreateModal = () => setShowCreateModal(true);
  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    fetchProfilesAndSmartCards(); // Refresh data after creating a profile
  };

  const handleShowEditModal = () => setShowEditModal(true);
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    fetchProfilesAndSmartCards(); // Refresh data after editing profiles
  };

  const handleActivateProfile = async (profileId, pin) => {
    if (pin === undefined || pin === null) {
      pin = ""
    }
    try {
      await BackendService.callAuthenticatedApi("setActiveProfile", { 
        profileId,
        activate:true,
        deviceName:"Roku",
        failIfInUse: false,
        pin: pin
      });
      // Validar si el perfil está activo
      validateActiveProfile(profileId);
      // Aquí puedes redirigir al usuario o actualizar algo
      //navigate("/bouquets"); // Por ejemplo, redirigir a la página principal
    } catch (err) {
      console.error("Error al activar perfil:", err);
      setError("No se pudo activar el perfil. Intenta nuevamente.");
    }
  };

  const validateActiveProfile = async (profileId) => {
    try {
      const response = await BackendService.callAuthenticatedApi("getClientConfig");
      const activeProfile = response.profiles.find((profile) => profile.id === profileId);
  
      if (activeProfile?.activeInThisSession) {
        console.log("El perfil está activo en esta sesión:", activeProfile.name);
        // Aquí puedes proceder con la lógica adicional, como redirigir al home
        alert(`Perfil "${activeProfile.name}" activado correctamente.`);
        navigate("/bouquets");
      } else {
        console.log("El perfil no está activo en esta sesión.");
        alert("No se pudo activar el perfil. Intenta nuevamente.");
      }
    } catch (error) {
      console.error("Error al validar el perfil activo:", error);
      setError("Hubo un problema al validar el perfil activo.");
    }
  };
  

  return (
    <div className="profiles-page">
      <h1>¿Quién está viendo?</h1>
      {loading ? (
        <p className="loading">Cargando...</p>
      ) : (
        <>
          <ProfilesList profiles={profiles} onActivateProfile={handleActivateProfile} />
          <div className="actions">
            <button
              className="add-profile-button"
              onClick={handleShowCreateModal}
              disabled={profiles.length >= smartCards.length}
            >
              +
            </button>
            <button className="edit-profiles-button" onClick={handleShowEditModal}>
              Editar Perfiles
            </button>
          </div>
        </>
      )}
      {showCreateModal && (
        <CreateProfileModal
          smartCards={smartCards}
          profiles={profiles}
          onClose={handleCloseCreateModal}
          onCreateProfile={handleCreateProfile}
        />
      )}
      {showEditModal && (
        <EditProfilesModal
          profiles={profiles}
          onClose={handleCloseEditModal}
          onDeleteProfile={handleDeleteProfile}
        />
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default ProfilesPage;
