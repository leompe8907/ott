import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          // Login
          signIn: 'Sign In',
          username: 'Username',
          password: 'Password',
          signInButton: 'Sign In',
          loginError: 'Login Error',
          incorrectCredentials: 'Incorrect username or password.',
          // ProfilesPage
          whoIsWatching: "Who is watching?",
          loading: "Loading...",
          noLicensesAvailable: "No licenses with associated products available.",
          loadError: "Failed to load profiles or smart cards. Please try again.",
          confirmDelete: "Are you sure you want to delete this profile?",
          profileDeleted: "Profile deleted successfully.",
          deleteError: "Error deleting profile. Please try again.",
          profileCreated: "Profile created successfully.",
          createError: "Error creating profile.",
          activateError: "Failed to activate profile. Please try again.",
          profileActivated: "Profile '{{name}}' activated successfully.",
          activateValidationError: "Profile activation failed. Please try again.",
          validateError: "Error validating active profile.",
          editProfiles: "-",
          // Modals
          success: 'Success',
          error: 'Error',
        },
      },
      es: {
        translation: {
          //Login
          signIn: 'Iniciar sesión',
          username: 'Nombre de usuario',
          password: 'Contraseña',
          signInButton: 'Iniciar sesión',
          loginError: 'Error de inicio de sesión',
          incorrectCredentials: 'Usuario o contraseña incorrectos.',

          // ProfilesPage
          whoIsWatching: "¿Quién está viendo ahora?",
          loading: "Cargando...",
          noLicensesAvailable: "No hay licencias con productos asociados disponibles.",
          loadError: "Fallo al cargar los perfiles o tarjetas inteligentes. Intenta nuevamente.",
          confirmDelete: "¿Estás seguro de que deseas eliminar este perfil?",
          profileDeleted: "Perfil eliminado exitosamente.",
          deleteError: "Error al eliminar el perfil. Intenta nuevamente.",
          profileCreated: "Perfil creado exitosamente.",
          createError: "Error al crear el perfil.",
          activateError: "No se pudo activar el perfil. Intenta nuevamente.",
          profileActivated: "Bienvenido '{{name}}'.",
          activateValidationError: "Fallo al activar el perfil. Intenta nuevamente.",
          validateError: "Hubo un problema al validar el perfil activo.",
          editProfiles: "-",
          // Modals
          success: 'Éxito',
          error: 'Error',
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
