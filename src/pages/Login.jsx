import React, { useState, useEffect, useRef } from "react"; // Asegúrate de importar useRef
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";

import {
  withFocusable,      // El componente wrapper para elementos enfocables
} from '@noriginmedia/react-spatial-navigation';

import CryptoJS from "crypto-js";

import Loading from "../components/Loading";
import BackendService from "../services/backendService";
import Modal from "../components/Modal";
import "../styles/login.scss";

// --- 2. Crear Componentes Enfocables Envolviendo Elementos HTML ---

// Componente para un Input Enfocable
// Recibe 'focused', 'setFocus' y 'onEnterPress' como props del HOC withFocusable
const FocusableInput = ({
  focused,
  setFocus, // Prop del HOC, se usa internamente o por la lógica del componente, no para el DOM
  onEnterPress,
  inputRef,
  // Desestructuramos y "sacamos" todas las props que el HOC pasa
  // pero que NO deben ir al elemento DOM (<input>)
  focusKey, // Esta se le pasa al HOC WrappedFocusableInput, NO al input interno
  parentFocusKey,
  realFocusKey,
  navigateByDirection,
  stealFocus,
  hasFocusedChild,
  pauseSpatialNavigation,
  resumeSpatialNavigation,
  updateAllSpatialLayouts,
  // Añade cualquier otra prop que withFocusable pudiera inyectar y que no sea para el DOM
  ...props // ¡Ahora, SÓLO los atributos HTML estándar deben quedar en `props`!
}) => {
  useEffect(() => {
    if (focused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [focused, inputRef]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onEnterPress) {
      onEnterPress();
    }
    // Asegúrate de llamar al onKeyDown original si existe
    if (props.onKeyDown) {
      props.onKeyDown(e);
    }
  };

  return (
    <input
      ref={inputRef}
      {...props} // Ahora, `props` solo contiene atributos HTML válidos
      onKeyDown={handleKeyDown}
      style={{
        outline: focused ? '4px solid #007bff' : 'none',
        transition: 'outline 0.1s ease-in-out',
      }}
    />
  );
};

// Envuelve el componente Input con withFocusable
const WrappedFocusableInput = withFocusable()(FocusableInput);

// Componente para un Botón Enfocable
const FocusableButton = ({
  focused, setFocus, onEnterPress, onClick,
  focusKey, parentFocusKey, realFocusKey, navigateByDirection, stealFocus,
  hasFocusedChild, pauseSpatialNavigation, resumeSpatialNavigation, updateAllSpatialLayouts,
  ...props // Estas son las props que van al <button>
}) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onEnterPress) {
      e.preventDefault();
      onEnterPress();
    }
    if (props.onKeyDown) {
      props.onKeyDown(e);
    }
  };

  return (
    <button
      {...props}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      style={{
        outline: focused ? '4px solid #007bff' : 'none',
        transition: 'outline 0.1s ease-in-out',
      }}
    />
  );
};

// Envuelve el componente Botón con withFocusable
const WrappedFocusableButton = withFocusable()(FocusableButton);


// Componente para el Toggle de Contraseña Enfocable
const FocusablePasswordToggle = ({
  focused, setFocus, onEnterPress, onClick, showPassword, FaEye, FaEyeSlash,
  focusKey, parentFocusKey, realFocusKey, navigateByDirection, stealFocus,
  hasFocusedChild, pauseSpatialNavigation, resumeSpatialNavigation, updateAllSpatialLayouts,
  ...props // Estas son las props que van al <span>
}) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onEnterPress) {
      onEnterPress();
    }
    if (props.onKeyDown) {
      props.onKeyDown(e);
    }
  };

  return (
    <span
      className="password-toggle"
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      style={{
        outline: focused ? '4px solid #007bff' : 'none',
        cursor: 'pointer',
        transition: 'outline 0.1s ease-in-out',
      }}
      {...props}
    >
      {showPassword ? <FaEyeSlash /> : <FaEye />}
    </span>
  );
};

// Envuelve el componente de Toggle con withFocusable
const WrappedFocusablePasswordToggle = withFocusable()(FocusablePasswordToggle);


const Login = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const secretKey = "CEVQmnhOsXvpRQZbGADl";
  const navigate = useNavigate();

  // 2. Usar useFocusable para cada elemento que quieres que sea enfocable
 // Referencias para los inputs, ya que withFocusable los necesita internamente
  const usernameInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const loginButtonRef = useRef(null); // No es estrictamente necesario para el botón, pero útil si quieres enfocarlo directamente


  // 3. Establecer el foco inicial
  useEffect(() => {
    // La documentación del HOC con withFocusable dice que puedes usar setFocus()
    // desde las props del componente envuelto para enfocar el primer hijo.
    // O puedes usar setFocus('focusKey') para enfocar uno específico.
    // Para simplificar, asumimos que 'username' es el foco inicial.
    // setFocus es una función global proporcionada por la librería para este propósito.
    const timer = setTimeout(() => {
      // Necesitamos una forma de acceder a la función global setFocus
      // Para ello, la importamos directamente de la librería:
      // import { setFocus } from '@noriginmedia/react-spatial-navigation';
      // (ya la hemos añadido arriba)
      // Opcional: si quieres que el input HTML interno tenga el foco real
      if (usernameInputRef.current) {
        usernameInputRef.current.focus();
      }
      // setFocus('username'); // Esto enfocaría el componente Focusable con la key 'username'
    }, 100);

    return () => clearTimeout(timer);
  }, []); // El array de dependencias vacío asegura que se ejecute una sola vez al montar

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let udid = localStorage.getItem("udid");
      if (!udid) {
        udid = uuidv4();
        console.log("UDID generado:", udid);
      }

      const sessionId = await BackendService.callLoginApi("clientLogin", {
        apiToken: secretKey,
        clientId: username,
        pwd: password,
        udid: udid,
      });

      if (!sessionId || sessionId.length === 0) {
        throw new Error(t("incorrectCredentials"));
      }

      const encryptedUsername = CryptoJS.AES.encrypt(
        username,
        secretKey
      ).toString();
      const encryptedPassword = CryptoJS.AES.encrypt(
        password,
        secretKey
      ).toString();

      localStorage.setItem("sessionId", sessionId);
      localStorage.setItem("username", encryptedUsername);
      localStorage.setItem("password", encryptedPassword);
      localStorage.setItem("udid", udid);
      console.log("Login exitoso. Session ID guardado:", sessionId);

      setTimeout(() => {
        setIsLoading(false);
        navigate("/profiles");
      }, 2000);
    } catch (err) {
      setTimeout(() => {
        setIsLoading(false);
        setModalMessage(err.message);
        setModalOpen(true);
        console.error("Error en el login:", err);
      }, 2000);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalMessage("");
  };

  //4. Manejador para el evento 'Enter' para mover el foco al siguiente elemento
  // Puedes manejar la navegación de "Enter" a través de los onEnterPress de los componentes envueltos
  // y usar setFocus programáticamente si es necesario, pero el HOC se encarga de gran parte.
  const handleUsernameEnter = () => {
    // Lógica para mover el foco al campo de contraseña
    // La librería gestionará el foco espacialmente, pero si necesitas forzar:
    // setFocus('password'); // setFocus global de la librería
    if (passwordInputRef.current) {
      passwordInputRef.current.focus();
    }
  };

  const handlePasswordEnter = () => {
    // Lógica para mover el foco al botón de login
    // setFocus('loginButton'); // setFocus global de la librería
    if (loginButtonRef.current) {
      loginButtonRef.current.focus();
    }
  };

  const handleTogglePasswordEnter = () => {
    togglePasswordVisibility();
  };

  const handleLoginButtonEnter = () => {
    // Simular el clic del botón al presionar Enter
    handleSubmit(new Event('submit', { cancelable: true }));
  };


  return (
    <div className="general">
      <section>
        <h1>{t("signIn")}</h1>
        <form onSubmit={handleSubmit}>
          {/* Campo Username con navegación espacial */}
          <div className="input-container">
            <WrappedFocusableInput
              focusKey="username"
              inputRef={usernameInputRef} // Pasa la ref al componente envuelto
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onEnterPress={handleUsernameEnter} // Maneja Enter para ir al siguiente
              required
              placeholder=" "
            />
            <label htmlFor="username" className="username">
              {t("username")}
            </label>
          </div>

          {/* Campo Password con navegación espacial */}
          <div className="input-container">
            <WrappedFocusableInput
              focusKey="password"
              inputRef={passwordInputRef} // Pasa la ref al componente envuelto
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onEnterPress={handlePasswordEnter} // Maneja Enter para ir al botón de login
              required
              placeholder=" "
            />
            <label htmlFor="password" className="password">
              {t("password")}
            </label>
          </div>

          {/* Botón para mostrar/ocultar contraseña con navegación espacial */}
          <WrappedFocusablePasswordToggle
            focusKey="togglePassword"
            showPassword={showPassword}
            FaEye={FaEye}
            FaEyeSlash={FaEyeSlash}
            onClick={togglePasswordVisibility}
            onEnterPress={handleTogglePasswordEnter} // Maneja Enter para alternar visibilidad
          />

          {/* Botón de login con navegación espacial */}
          <WrappedFocusableButton
            focusKey="loginButton"
            type="submit"
            disabled={isLoading}
            onEnterPress={handleLoginButtonEnter} // Maneja Enter para enviar el formulario
          >
            {isLoading ? t("signingIn") : t("signInButton")}
          </WrappedFocusableButton>
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