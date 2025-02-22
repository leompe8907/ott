import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          signIn: 'Sign In',
          username: 'Username',
          password: 'Password',
          signInButton: 'Sign In',
          loginError: 'Login Error',
          incorrectCredentials: 'Incorrect username or password.',
        },
      },
      es: {
        translation: {
          signIn: 'Iniciar sesión',
          username: 'Nombre de usuario',
          password: 'Contraseña',
          signInButton: 'Iniciar sesión',
          loginError: 'Error de inicio de sesión',
          incorrectCredentials: 'Usuario o contraseña incorrectos.',
        },
      },
    },
    lng: navigator.language.split('-')[0] || 'en',  // Detecta el idioma del navegador
    fallbackLng: 'en', // Idioma por defecto si no se encuentra el idioma del navegador
    interpolation: {
      escapeValue: false, // No escapar valores para React
    },
  });

export default i18n;
