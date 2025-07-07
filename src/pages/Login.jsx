import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useTranslation } from "react-i18next"; // Importar hook de i18n
import { v4 as uuidv4 } from "uuid"

import CryptoJS from "crypto-js";

import Loading from "../components/Loading"; // Importar el componente de carga
import BackendService from "../services/backendService";
import Modal from "../components/Modal";
import "../styles/login.scss";

const Login = () => {
  const { t } = useTranslation(); // Usar el hook para obtener la función de traducción
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Nuevo estado para controlar el loading

  const secretKey = "CEVQmnhOsXvpRQZbGADl";
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Activar el loading al inicio del proceso

    try {
      // Asegurarse de que el UDID está disponible
      let udid = localStorage.getItem("udid");
      if (!udid) {
        udid = uuidv4(); // Genera el UDID si no existe
        console.log("UDID generado:", udid);
      }

      // Llamar al backend con el UDID
      const sessionId = await BackendService.callLoginApi("clientLogin", {
        apiToken: secretKey,
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
      localStorage.setItem("udid", udid);
      console.log("Login exitoso. Session ID guardado:", sessionId);

      // Simulación de tiempo de espera (elimina esto si el backend ya tiene suficiente latencia)
      setTimeout(() => {
        setIsLoading(false); // Desactivar el loading
        navigate("/profiles");
      }, 2000); // 2 segundos de espera simulada
    } catch (err) {
      setTimeout(() => {
        setIsLoading(false); // Desactivar el loading
        setModalMessage(err.message);
        setModalOpen(true);
        console.error("Error en el login:", err);
      }, 2000); // 2 segundos de espera simulada antes de mostrar el error
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
          {/* Traducción del campo Username */}
          <div className="input-container">
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder=" "
            />
            <label htmlFor="username" className="username">
              {t("username")}
            </label>{" "}
          </div>
          {/* Traducción del campo Password */}
          <div className="input-container">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder=" "
            />
            <label htmlFor="password" className="password">
              {t("password")}
            </label>{" "}
          </div>
            <span className="password-toggle" onClick={togglePasswordVisibility}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          {/* Traducción del botón Sign In */}
          <button type="submit" disabled={isLoading}>
            {isLoading ? t("signingIn") : t("signInButton")}
          </button>{" "}
        </form>
      </section>
      {isLoading && <Loading />}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={t("loginError")}
        message={modalMessage}
        type="error"
      />

    </div>
  );
};

export default Login;
