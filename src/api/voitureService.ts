import axios from './axiosConfig';
import type { Voiture } from '../types/voiture';
import type { Place } from '../types/voiture';

const BASE_URL = import.meta.env.VITE_API_URL || "/api";
const API_URL = `${BASE_URL}/api/voiture`;
const PLACE_URL = `${BASE_URL}/api/place`;  // corrigé : manquait /api/

export const saveVoiture = async (voiture: Voiture) => {
  return await axios.post(API_URL, voiture);
};

export const getVoitures = async () => {
  try {
    const response = await axios.get<Voiture[]>(API_URL);
    console.log('API Response:', response);
    const data = response.data;
    const voituresList = Array.isArray(data) ? data : (data || []);
    console.log('Voitures récupérées:', voituresList);
    return { data: voituresList };
  } catch (error: any) {
    console.error('Erreur API voiture:', error);
    return { data: [] };
  }
};

export const deleteVoiture = async (idVoit: string) => {
  try {
    console.log(`Suppression de la voiture: ${idVoit}`);
    const response = await axios.delete(`${API_URL}/${idVoit}`);
    console.log(`Voiture ${idVoit} supprimée avec succès`);
    return response;
  } catch (error: any) {
    console.error(`Erreur suppression voiture ${idVoit}:`, error);
    if (error.response?.status === 502 || error.response?.status === 503) {
      throw new Error('Le serveur backend n\'est pas accessible. Vérifiez qu\'il est en cours d\'exécution.');
    }
    throw error;
  }
};

export const updateVoiture = async (idVoit: string, voiture: Voiture) => {
  try {
    console.log(`Mise à jour de la voiture: ${idVoit}`, voiture);
    const response = await axios.put(`${API_URL}/${idVoit}`, voiture);
    console.log(`Voiture ${idVoit} mise à jour avec succès`);
    return response;
  } catch (error: any) {
    console.error(`Erreur mise à jour voiture ${idVoit}:`, error);
    if (error.response?.status === 502 || error.response?.status === 503) {
      throw new Error('Le serveur backend n\'est pas accessible. Vérifiez qu\'il est en cours d\'exécution.');
    }
    throw error;
  }
};

export const getAllPlacesByVoiture = async (idVoit: string) => {
  try {
    const response = await axios.get<Place[]>(`${PLACE_URL}/${idVoit}/toutes`);
    return { data: Array.isArray(response.data) ? response.data : [] };
  } catch (error) {
    console.error(`Erreur récupération places voiture ${idVoit}:`, error);
    return { data: [] };
  }
};

export const countPlacesLibres = async (idVoit: string) => {
  try {
    const response = await axios.get<number>(`${PLACE_URL}/${idVoit}/libre/count`); // corrigé : libres → libre
    return response;
  } catch (error) {
    console.error(`Erreur comptage places libres ${idVoit}:`, error);
    throw error;
  }
};