import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CreateProfileModal from "../components/CreateProfileModal";
import EditProfilesModal from "../components/EditProfilesModal";
import ProfilesList from "../components/ProfilesList";
import BackendService from "../services/backendService";
import Modal from "../components/Modal"; // Importar el modal
import "../styles/profilesPage.scss";

const ProfilesPage = () => {
  const [profiles, setProfiles] = useState([]);
  const [smartCards, setSmartCards] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Estado para el modal de mensajes
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");

  const navigate = useNavigate();

  // Función para mostrar el modal con mensajes
  const showModal = (message, type = "success") => {
    setModalMessage(message);
    setModalType(type);
    setModalOpen(true);
  };

  // Obtener perfiles y tarjetas inteligentes
  const fetchProfilesAndSmartCards = async () => {
    setLoading(true);
    try {
      const profileResponse = await BackendService.callAuthenticatedApi("getClientConfig");
      const smartCardResponse = await BackendService.callAuthenticatedApi("getStreamingLicenses", {
        withPins: true,
      });
      
      // Filtrar solo las tarjetas inteligentes con productos asociados
      const validSmartCards = smartCardResponse.filter(
        (card) => card.products && card.products.trim() !== ""
      );

      setProfiles(profileResponse?.profiles || []);
      setSmartCards(validSmartCards || []);

      if (validSmartCards.length === 0) {
        showModal("No hay licencias con productos asociados disponibles.", "error");
      }
    } catch (err) {
      console.error("Error al obtener perfiles o tarjetas inteligentes:", err);
      showModal("Hubo un problema al cargar los datos. Intenta nuevamente.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProfile = async (profileId) => {
    if (showModal("¿Estás seguro de que deseas eliminar este perfil?")) {
      return;
    }
  
    try {
      setLoading(true);
      await BackendService.callAuthenticatedApi("deleteProfile", { profileId });
      fetchProfilesAndSmartCards(); // Refrescar perfiles después de eliminar
      showModal("Perfil eliminado exitosamente.", "success");
    } catch (err) {
      console.error("Error al eliminar perfil:", err);
      showModal("Hubo un error al eliminar el perfil. Intenta nuevamente.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProfile = async (newProfile) => {
    try {
      setLoading(true);
      await BackendService.callAuthenticatedApi("createProfile", newProfile);
      fetchProfilesAndSmartCards(); // Actualizar la lista de perfiles
      setShowCreateModal(false); // Cerrar el modal
      showModal("Perfil creado exitosamente.", "success");
    } catch (err) {
      console.error("Error al crear perfil:", err);
      showModal(err.message, "error");
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
        deviceName:"Web",
        failIfInUse: false,
        pin: pin
      });
      // Validar si el perfil está activo
      validateActiveProfile(profileId);
      // Aquí puedes redirigir al usuario o actualizar algo
      //navigate("/bouquets"); // Por ejemplo, redirigir a la página principal
    } catch (err) {
      console.error("Error al activar perfil:", err);
      showModal("No se pudo activar el perfil. Intenta nuevamente.", "error");
    }
  };

  const validateActiveProfile = async (profileId) => {
    try {
      const response = await BackendService.callAuthenticatedApi("getClientConfig");
      const activeProfile = response.profiles.find((profile) => profile.id === profileId);
  
      if (activeProfile?.activeInThisSession) {
        console.log("El perfil está activo en esta sesión:", activeProfile.name);
        // Aquí puedes proceder con la lógica adicional, como redirigir al home
        showModal(`Perfil "${activeProfile.name}" activado correctamente.`, "success");
        navigate("/bouquets");
      } else {
        console.log("El perfil no está activo en esta sesión.");
        showModal("No se pudo activar el perfil. Intenta nuevamente.", "error");
      }
    } catch (error) {
      console.error("Error al validar el perfil activo:", error);
      showModal("Hubo un problema al validar el perfil activo.", "error");
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

export default ProfilesPage;
