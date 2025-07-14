import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {initNavigation, setKeyMap} from '@noriginmedia/react-spatial-navigation';


import Splash from "./pages/Splash";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ProfilesPage  from "./pages/ProfilesPage";
import EditProfilesModal from "./components/profiles/EditProfilesModal";
import CreateProfileModal from "./components/profiles/CreateProfileModal.jsx";
import ProfilesList from "./components/profiles/ProfilesList.jsx";
import Bouquets from "./components/Bouquets";
import AuthValidator from "./hooks/AuthValidator.jsx";

// 1. Inicialización de la Navegación Espacial
initNavigation({
  debug: true, // Puedes poner 'true' para ver los logs de depuración en la consola
  visualDebug: true, // Si quieres ver los contornos visuales de los elementos enfocables
});

setKeyMap({
  'left': 37, 'up': 38, 'right': 39, 'down': 40, 'enter': 13
});

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profiles" element={<ProfilesPage />} />
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
