import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Splash from "./pages/Splash";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ProfilesPage  from "./pages/ProfilesPage";
import Profiles from "./pages/Profiles";
import EditProfilesModal from "./components/EditProfilesModal";
import CreateProfileModal from "./components/CreateProfileModal";
import ProfilesList from "./components/ProfilesList";
import Bouquets from "./components/Bouquets";
import AuthValidator from "./components/AuthValidator";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profiles" element={<ProfilesPage />} />
        <Route path="/profile" element={<Profiles />} />
        <Route path="/eliminar" element={<EditProfilesModal />} />
        <Route path="/crear" element={<CreateProfileModal/>} />
        <Route path="/lista" element={<ProfilesList/>} />
        <Route path="/bouquets" element={<Bouquets/>} />
        <Route path="/Auto" element={<AuthValidator/>} />

      </Routes>
    </Router>
  );
};

export default App;
