import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import BackendService from "../services/backendService";

const AuthValidator = () => {
  const navigate = useNavigate();
  
  const secretKey = "CEVQmnhOsXvpRQZbGADl"
  
  useEffect(() => {
    const validateSession = async () => {
      try {
        const sessionId = localStorage.getItem("sessionId");

        // Si no existe sessionId, redirigir a login
        if (!sessionId) {
          console.log("No existe sessionId. Redirigiendo a Login...");
          navigate("/login");
          return;
        }

        // Validar sessionId con getClientConfig
        const clientConfig = await BackendService.callAuthenticatedApi("getClientConfig");

        if (clientConfig) {
          console.log("SessionId válido. Redirigiendo a Profiles...");
          navigate("/profiles");
          return;
        }

        // Si la validación falla, intentar iniciar sesión automáticamente
        const username = CryptoJS.AES.decrypt(localStorage.getItem("username"), secretKey).toString(CryptoJS.enc.Utf8);
        const password = CryptoJS.AES.decrypt(localStorage.getItem("password"), secretKey).toString(CryptoJS.enc.Utf8);

        if (!username || !password) {
          console.log("No se encontraron credenciales almacenadas. Redirigiendo a Login...");
          navigate("/login");
          return;
        }

        console.log("Intentando iniciar sesión automáticamente...");
        const sessionIdNew = await BackendService.callLoginApi("clientLogin", {
          apiToken: "CEVQmnhOsXvpRQZbGADl",
          clientId: username,
          pwd: password,
          udid: localStorage.getItem("udid"),
        });

        // Validar que sessionId es válido
        if (!sessionIdNew || sessionIdNew.length === 0) {
          throw new Error("Credenciales inválidas.");
        }

        // Guardar el nuevo sessionId y redirigir a profiles
        localStorage.setItem("sessionId", sessionIdNew);
        console.log("Inicio de sesión automático exitoso. Redirigiendo a Profiles...");
        navigate("/profiles");
      } catch (error) {
        console.error("Error en la validación de sesión o inicio de sesión automático:", error);
        navigate("/login"); // Redirigir a login en caso de error
      }
    };

    validateSession();
  }, [navigate]);

  return null; // Este componente no necesita renderizar nada
};

export default AuthValidator;
