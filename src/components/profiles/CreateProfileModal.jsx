import React, { useState } from "react";
import { useTranslation } from "react-i18next"; 
import Img from "../../constants/images";
import "../../styles/createProfileModal.scss";
import Modal from "../Modal"

const CreateProfileModal = ({ smartCards, profiles, onClose, onCreateProfile }) => {
  const { t } = useTranslation();
  const [newProfileName, setNewProfileName] = useState("");
  const [selectedImage, setSelectedImage] = useState(Img[0]?.id || null);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState({ open: false, message: "", type: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newProfileName.trim()) {
      setFeedback({ open: true, message: t("nameRequired"), type: "error" });
      return;
    }

    if (!selectedImage) {
      setFeedback({ open: true, message: t("selectImage"), type: "error" });
      return;
    }

    const availableCard = smartCards.find(card => 
      !profiles.some(profile => profile.sn === card.key)
    );

    if (!availableCard) {
      setFeedback({ open: true, message: t("noCards"), type: "error" });
      return;
    }

    setIsLoading(true);
    try {
      await onCreateProfile({
        name: newProfileName,
        imageId: selectedImage,
        license: availableCard.key,
        pin: availableCard.pin
      });

      setFeedback({ 
        open: true, 
        message: t("profileCreated"), 
        type: "success" 
      });

      setTimeout(() => {
        setNewProfileName("");
        setSelectedImage(Img[0]?.id || null);
        onClose();
      }, 1500);
    } catch (error) {
      setFeedback({ 
        open: true, 
        message: t("profileError"), 
        type: "error" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-container">
      <div className="profile-modal">
        <div className="modal-header">
          <h2>{t("addProfile")}</h2>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <input
              type="text"
              value={newProfileName}
              onChange={(e) => setNewProfileName(e.target.value)}
              maxLength={30}
              placeholder={t("pleaceHolder")}
            />
            <span className="char-count">{newProfileName.length}/30</span>
          </div>

          <div className="avatar-selection">
            <h3>{t("selectImg")}</h3>
            <div className="avatar-grid">
              {Img.map((img) => (
                <div 
                  key={img.id}
                  className={`avatar-option ${selectedImage === img.id ? 'selected' : ''}`}
                  onClick={() => setSelectedImage(img.id)}
                >
                  <img src={img.img} alt={`Avatar ${img.id}`} />
                  {selectedImage === img.id && (
                    <div className="checkmark">✓</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              {t("cancel")}
            </button>
            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  {t("loading", "Creando...")}
                </>
              ) : (
                t("accept")
              )}
            </button>
          </div>
        </form>
      </div>

      <Modal
        isOpen={feedback.open}
        onClose={() => setFeedback({ ...feedback, open: false })}
        title={t(feedback.type)}
        message={feedback.message}
        type={feedback.type}
      />
    </div>
  );
};

export default CreateProfileModal;
