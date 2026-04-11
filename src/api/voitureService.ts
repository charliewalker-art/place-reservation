import axios from 'axios';
import type { Voiture } from '../types/voiture';

import type { Place } from '../types/voiture';

const BASE_URL = "/api";

const API_URL = `${BASE_URL}/voiture`;


const PLACE_URL = `${BASE_URL}/place`;

export const saveVoiture = async (voiture: Voiture) => {
  return await axios.post(API_URL, voiture);
}

// Récupère la liste des voitures
export const getVoitures = async () => {
  try {
    const response = await axios.get<Voiture[]>(API_URL);
    console.log('API Response:', response);

    // Gérer les différents formats de réponse possibles
    const data = response.data;
    const voituresList = Array.isArray(data) ? data : (data || []);

    console.log('Voitures récupérées:', voituresList);
    return { data: voituresList };
  } catch (error: any) {
    console.error('Erreur API voiture:', error);
    // Retourner un array vide au lieu de throw pour éviter les erreurs dans l'UI
    return { data: [] };
  }
};

// Supprime une voiture par ID (cascade delete sur les places)
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

// Met à jour une voiture (design, type, frais - pas nbrPlace)
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
    const response = await axios.get<number>(`${PLACE_URL}/${idVoit}/libres/count`);
    return response;
  } catch (error) {
    console.error(`Erreur comptage places libres ${idVoit}:`, error);
    throw error;
  }
};