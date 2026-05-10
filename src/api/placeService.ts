import axios from './axiosConfig';

const BASE_URL = import.meta.env.VITE_API_URL || "/api";
const API_URL = `${BASE_URL}/api/place`;

export const getCountPlacesLibres = async (idVoit: string) => {
  try {
    console.log(`Fetching count for voiture: ${idVoit}`);
    const response = await axios.get<number>(`${API_URL}/${idVoit}/libre/count`);
    console.log(`Count response for ${idVoit}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Erreur getting count for ${idVoit}:`, error);
    return 0;
  }
};

export const getPlacesLibres = async (idVoit: string) => {
  try {
    const response = await axios.get(`${API_URL}/${idVoit}/libre`);
    return response.data;
  } catch (error) {
    console.error(`Erreur getting places for ${idVoit}:`, error);
    return [];
  }
};