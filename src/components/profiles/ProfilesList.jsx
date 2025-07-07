import React from "react";
import { withFocusable } from "@noriginmedia/react-spatial-navigation"; // Cambiado a withFocusable
import "../../styles/Profile/profilesList.scss";

const ProfileCard = withFocusable()(({ profile, onEnterPress }) => (
  <div className="profile-card" onClick={onEnterPress}>
    <img
      src={`https://pmdw-1.in.tv.br/cv_data_pub/images/${profile.imageId}/v/thumb.png`} // Ajusta la URL según tu lógica
      alt={profile.name}
    />
    <p>{profile.name}</p>
  </div>
));

const ProfilesList = ({ profiles, onActivateProfile }) => {
  return (
    <div className="profiles-list">
      {profiles.map((profile) => (
        <ProfileCard
          key={profile.id}
          profile={profile}
          onEnterPress={() => onActivateProfile(profile.id, profile.pin)}
        />
      ))}
    </div>
  );
};

export default ProfilesList;