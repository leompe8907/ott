import React, {useState} from 'react';
import BackendService from "../services/backendService";
import { useEffect } from 'react';

function Bouquets(props) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch profiles and smart cards from the backend
  const fetchBouquets = async () => {
    try {
      const profileResponse = await BackendService.callAuthenticatedApi("getBouquets");
      console.log(profileResponse);
    } catch (err) {
      console.error("Error al obtener perfiles o tarjetas inteligentes:", err);
      setError("Hubo un problema al cargar los datos. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBouquets();
  },[])

  return (
    <div>
        
    </div>
  );
}

export default Bouquets;