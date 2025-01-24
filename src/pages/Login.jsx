import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";

import BackendService from "../services/backendService";
import GetUdid from "../cv/Udid";
import Modal from "../components/Modal";
import "../styles/login.scss";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [error, setError] = useState(null);

  const secretKey = "CEVQmnhOsXvpRQZbGADl"

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
        throw new Error("Error en el usuario o contraseña.");
      }

      // Encriptar
      const encryptedUsername = CryptoJS.AES.encrypt(username, secretKey).toString();
      const encryptedPassword = CryptoJS.AES.encrypt(password, secretKey).toString();

      // Guardar el sessionId
      localStorage.setItem("sessionId", sessionId);
      localStorage.setItem("username",encryptedUsername );
      localStorage.setItem("password",encryptedPassword );
      console.log("Login exitoso. Session ID guardado:", sessionId);

      // Redirigir al profiles
      navigate("/profiles");
    } catch (err) {
      setError(err.message);
      setModalMessage(err.message);
      setModalOpen(true);
      console.error("Error en el login:", err);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalMessage("");
  };

  return (
    <div className="general">
      <section>
        <h1>Sign In</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Sign In</button>
          {/* {error && <p className="error">{error}</p>} */}
        </form>
      </section>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h2>Error de inicio de sesión</h2>
        <p>{modalMessage}</p>
      </Modal>
    </div>
  );
};

export default Login;
