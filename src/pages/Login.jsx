import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useTranslation } from "react-i18next"; // Importar hook de i18n

import BackendService from "../services/backendService";
import GetUdid from "../cv/Udid";
import Modal from "../components/Modal";
import "../styles/login.scss";

const Login = () => {
  const { t } = useTranslation(); // Usar el hook para obtener la función de traducción
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const secretKey = "CEVQmnhOsXvpRQZbGADl";

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Asegurarse de que el UDID está disponible
      let udid = localStorage.getItem("udid");
      if (!udid) {
        udid = GetUdid(); // Genera el UDID si no existe
        console.log("UDID generado:", udid);
      }

      // Llamar al backend con el UDID
      const sessionId = await BackendService.callLoginApi("clientLogin", {
        apiToken: "CEVQmnhOsXvpRQZbGADl",
        clientId: username,
        pwd: password,
        udid: udid, // Aseguramos que se pase el UDID correcto
      });

      // Validar que sessionId es válido
      if (!sessionId || sessionId.length === 0) {
        throw new Error(t("incorrectCredentials")); // Usar traducción aquí
      }

      // Encriptar
      const encryptedUsername = CryptoJS.AES.encrypt(
        username,
        secretKey
      ).toString();
      const encryptedPassword = CryptoJS.AES.encrypt(
        password,
        secretKey
      ).toString();

      // Guardar el sessionId
      localStorage.setItem("sessionId", sessionId);
      localStorage.setItem("username", encryptedUsername);
      localStorage.setItem("password", encryptedPassword);
      console.log("Login exitoso. Session ID guardado:", sessionId);

      // Redirigir al profiles
      navigate("/profiles");
    } catch (err) {
      setModalMessage(err.message);
      setModalOpen(true);
      console.error("Error en el login:", err);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Cambiar el estado de visibilidad de la contraseña
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalMessage("");
  };

  return (
    <div className="general">
      <section>
        <h1>{t("signIn")}</h1> {/* Traducción del título */}
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder=" " // Es necesario para que funcione el efecto de animación
            />
            <label htmlFor="username" className="username">
              {t("username")}
            </label>{" "}
            {/* Traducción del campo Username */}
          </div>
          <div className="input-container">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder=" " // Es necesario para que funcione el efecto de animación
            />
            <label htmlFor="password" className="password">
              {t("password")}
            </label>{" "}
            {/* Traducción del campo Password */}
            <span
              className="password-toggle"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Icono de ojo */}
            </span>
          </div>
          <button type="submit">{t("signInButton")}</button>{" "}
          {/* Traducción del botón Sign In */}
        </form>
      </section>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h2>{t("loginError")}</h2> {/* Traducción del título del modal */}
        <p>{modalMessage}</p>
      </Modal>
    </div>
  );
};

export default Login;
