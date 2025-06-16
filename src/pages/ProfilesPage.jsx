import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { initNavigation, withFocusable } from "@noriginmedia/react-spatial-navigation"; // Cambiar a withFocusable
import CreateProfileModal from "../components/profiles/CreateProfileModal";
import ProfilesList from "../components/profiles/ProfilesList";
import BackendService from "../services/backendService";
import Modal from "../components/Modal";
import "../styles/profilesPage.scss";

// Inicializar la navegación (mejor hacerlo en App.js, pero aquí para simplicidad)
initNavigation({
  debug: false, // Para depuración
  visualDebug: false, // Mostrar líneas de navegación (útil para pruebas)
});

const ProfilesPage = () => {
  const { t } = useTranslation();
  const [profiles, setProfiles] = useState([]);
  const [smartCards, setSmartCards] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
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
        showModal(t("noLicensesAvailable"), "error");
      }
    } catch (err) {
      console.error("Error al obtener perfiles o tarjetas inteligentes:", err);
      showModal(t("loadError"), "error");
      navigate("/login"); // Ir a la página de login si no hay perfiles o tarjetas inteligentes
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProfile = async (newProfile) => {
    try {
      setLoading(true);
      await BackendService.callAuthenticatedApi("createProfile", newProfile);
      fetchProfilesAndSmartCards();
      setShowCreateModal(false);
      showModal(t("profileCreated"), "success");
    } catch (err) {
      console.error("Error al crear perfil:", err);
      showModal(err.message || t("createError"), "error");
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

  const handleActivateProfile = async (profileId, pin) => {
    if (pin === undefined || pin === null) {
      pin = "";
    }
    try {
      setLoading(true);
      await BackendService.callAuthenticatedApi("setActiveProfile", {
        profileId,
        activate: true,
        deviceName: "Web",
        failIfInUse: false,
        pin,
      });
      // Validar si el perfil está activo
      validateActiveProfile(profileId);
    } catch (err) {
      console.error("Error al activar perfil:", err);
      showModal(t("activateError"), "error");
    } finally {
      setLoading(false);
    }
  };

  const validateActiveProfile = async (profileId) => {
    try {
      const response = await BackendService.callAuthenticatedApi("getClientConfig");
      const activeProfile = response.profiles.find((profile) => profile.id === profileId);

      if (activeProfile?.activeInThisSession) {
        console.log("El perfil está activo en esta sesión:", activeProfile.name);
        showModal(t("profileActivated", { name: activeProfile.name }), "success");
        navigate("/bouquets");
      } else {
        showModal(t("activateValidationError"), "error");
      }
    } catch (error) {
      console.error("Error al validar el perfil activo:", error);
      showModal(t("validateError"), "error");
    }
  };

  // Usa withFocusable correctamente con un componente de función
  const FocusableButtonAdd = withFocusable()(({ onEnterPress, children }) => (
    <button onClick={onEnterPress} className="add-profile-button" disabled={profiles.length >= smartCards.length} >+</button> // El componente de botón se pasa correctamente
  ));

  return (
    <div className="profiles-page">
      <h1>{t("whoIsWatching")}</h1>
      {loading ? (
        <div className="loading">{t("loading")}</div>
      ) : (
        <>
          <div className="profiles-header">
            <ProfilesList profiles={profiles} onActivateProfile={handleActivateProfile} />
            {profiles.length < smartCards.length && (
              <FocusableButtonAdd onEnterPress={handleShowCreateModal} />
            )}
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
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalType === "success" ? t("success") : t("error")}
        message={modalMessage}
        type={modalType}
      />
    </div>
  );

};

export default ProfilesPage;
