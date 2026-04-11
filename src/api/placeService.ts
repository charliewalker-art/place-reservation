import axios from 'axios';

const BASE_URL = "/api";
const API_URL = `${BASE_URL}/place`;

// Récupère le nombre de places libres pour calculer la barre de progression
export const getCountPlacesLibres = async (idVoit: string) => {
  try {
    console.log(`Fetching count for voiture: ${idVoit}`);
    const response = await axios.get<number>(`${API_URL}/${idVoit}/libre/count`);
    console.log(`Count response for ${idVoit}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Erreur getting count for ${idVoit}:`, error);
    // Retourner 0 en cas d'erreur plutôt que de crasher
    return 0;
  }
};

// Si vous avez besoin de la liste complète des places plus tard
export const getPlacesLibres = async (idVoit: string) => {
  try {
    const response = await axios.get(`${API_URL}/${idVoit}/libre`);
    return response.data;
  } catch (error) {
    console.error(`Erreur getting places for ${idVoit}:`, error);
    return [];
  }
};