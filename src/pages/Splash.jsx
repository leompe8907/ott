import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; // Importar hook de i18n
import CryptoJS from 'crypto-js'; // Importar CryptoJS correctamente

import BackendService from "../services/backendService";

const Splash = () => {
  const { t } = useTranslation(); // Usar el hook para obtener la función de traducción
  const navigate = useNavigate(); // Hook para navegar entre rutas

  // elementos del login
  const username = localStorage.getItem('username');
  const password = localStorage.getItem('password');
  const udid = localStorage.getItem('udid');
  const secretKey = "CEVQmnhOsXvpRQZbGADl";

  // validar credenciales
  const validarCredenciales = async () => {
    try {
      // Verificar si los parámetros necesarios existen
      if (!username || !password || !udid) {
        navigate("/login");
        return;
      }

      // Desencriptar username y password
      const decryptUser = CryptoJS.AES.decrypt(username, secretKey);
      const decryptedUsername = decryptUser.toString(CryptoJS.enc.Utf8);

      const decryptPass = CryptoJS.AES.decrypt(password, secretKey);
      const decryptedPassword = decryptPass.toString(CryptoJS.enc.Utf8);

      // Realizar la llamada a la API
      const sessionId = await BackendService.callLoginApi("clientLogin", {
        apiToken: secretKey,
        clientId: decryptedUsername,
        pwd: decryptedPassword,
        udid: udid,
      });

      // Verificar si el sessionId es válido
      if (!sessionId || sessionId === "null" || sessionId === "undefined") {
        throw new Error(t("incorrectCredentials"));
      }

      // Guardar el sessionId
      localStorage.setItem("sessionId", sessionId);
      navigate("/profiles");
    } catch (error) {
      console.error("Login error:", error);
      navigate("/login");
    }
  };

  useEffect(() => {
    // Retraso de 3 segundos antes de llamar la función
    setTimeout(() => {
      validarCredenciales();
    }, 3000); // 3000 milisegundos = 3 segundos
  }, []);
  
  return (
    <div className="splash-screen">
      <h1>Cargando...</h1>
    </div>
  );
};

export default Splash;
