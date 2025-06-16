import { useTranslation } from "react-i18next"; 
import "../styles/loading.scss"; // Estilos para la animación

const Loading = () => {
  const { t } = useTranslation();
  return (
    <div className="loading-overlay">
      <div className="spinner"></div>
      <p>{t("loading")}</p>
    </div>
  );
};

export default Loading;