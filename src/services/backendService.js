import { CV } from "../cv/cv";

class BackendService {
  async initialize(options) {
    try {
      await CV.init(options);
      console.log("Initialization successful");
    } catch (error) {
      console.error("Initialization failed:", error);
      throw error;
    }
  }

  // Función exclusiva para login
  async callLoginApi(method, parameters = {}) {
    try {
      console.log("Llamando a la API (login):", method, parameters);
      const result = await CV.call(method, parameters);
      console.log("Respuesta de la API (login):", result);
      return result; // Retorna solo el resultado
    } catch (error) {
      console.error(`Error en la llamada de login (${method}):`, error);
      throw error;
    }
  }
  // Función para todas las demás llamadas autenticadas
  async callAuthenticatedApi(method, parameters = {}) {
    try {
      const sessionId = localStorage.getItem("sessionId");
      const udid = localStorage.getItem("udid");

      if (!sessionId || !udid) {
        throw new Error("Faltan el sessionId o el udid.");
      }

      parameters = {
        ...parameters,
        sessionId,
        udid,
      };

      console.log("Llamando a la API (autenticada):", method, parameters);
      const result = await CV.call(method, parameters);
      console.log("Respuesta de la API (autenticada):", result);
      return result; // Retorna solo el resultado
    } catch (error) {
      console.error(`Error en la llamada (${method}):`, error);
      throw error;
    }
  }

  logout() {
    CV.logout();
    console.log("Logged out successfully");
  }
}

const backendServiceInstance = new BackendService();
export default backendServiceInstance;
