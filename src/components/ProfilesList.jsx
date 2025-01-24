import React from "react";
import "../styles/profilesList.scss";

const ProfilesList = ({ profiles, onActivateProfile }) => {
  return (
    <div className="profiles-list">
      {profiles && profiles.length > 0 ? (
        profiles.map((profile) => (
          <div
            key={profile.id}
            className="profile-card"
            onClick={() => onActivateProfile(profile.id, profile.pin)}
          >
            <img
              src={`https://pmdw-1.in.tv.br/cv_data_pub/images/${profile.imageId}/v/thumb.png`}
              alt={profile.name}
            />
            <p>{profile.name}</p>
          </div>
        ))
      ) : (
        <p className="no-profiles">No hay perfiles disponibles.</p>
      )}
    </div>
  );
};

export default ProfilesList;

