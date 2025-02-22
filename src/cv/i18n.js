import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        signIn: "Sign In",
        username: "Username",
        password: "Password",
        signInButton: "Sign In",
        loginError: "Login Error",
        incorrectCredentials: "Incorrect username or password.",
      },
    },
    es: {
      translation: {
        signIn: "Iniciar sesión",
        username: "Nombre de usuario",
        password: "Contraseña",
        signInButton: "Iniciar sesión",
        loginError: "Error de inicio de sesión",
        incorrectCredentials: "Usuario o contraseña incorrectos.",
      },
    },
  },
  lng: "en", // Idioma por defecto
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, // no escape para react
  },
});

export default i18n;
