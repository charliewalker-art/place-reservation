import axios from 'axios';
import type { Reservation, VoyageurDTO, DashboardDTO,RecuDTO } from '../types/reservation';

const API_URL = 'http://127.0.0.1:8080/api/reservation';

export const createReservation = async (
  idVoit: string,
  idCli: number,
  reservation: Reservation
) => {
  try {
    const response = await axios.post<Reservation>(
      `${API_URL}/${idVoit}/${idCli}`,
      reservation
    );
    return response;
  } catch (error: any) {
    console.error('Erreur création réservation:', error);
    if (error.response?.status === 502 || error.response?.status === 503) {
      throw new Error('Le serveur backend n\'est pas accessible. Vérifiez qu\'il est en cours d\'exécution.');
    }
    throw error;
  }
};

export const getReservations = async () => {
  try {
    const response = await axios.get<Reservation[]>(API_URL);
    return { data: Array.isArray(response.data) ? response.data : [] };
  } catch (error: any) {
    console.error('Erreur récupération réservations:', error);
    // Retourner un array vide au lieu de throw
    return { data: [] };
  }
};

export const getReservationsByVoiture = async (idVoit: string) => {
  try {
    const response = await axios.get<Reservation[]>(`${API_URL}/voiture/${idVoit}`);
    return { data: Array.isArray(response.data) ? response.data : [] };
  } catch (error: any) {
    console.error(`Erreur récupération réservations voiture ${idVoit}:`, error);
    // Retourner un array vide au lieu de throw
    return { data: [] };
  }
};

export const updateReservation = async (idReserv: string, reservation: Partial<Reservation>) => {
  try {
    const response = await axios.put<Reservation>(`${API_URL}/${idReserv}`, reservation);
    return response;
  } catch (error: any) {
    console.error(`Erreur mise à jour réservation ${idReserv}:`, error);
    if (error.response?.status === 502 || error.response?.status === 503) {
      throw new Error('Le serveur backend n\'est pas accessible. Vérifiez qu\'il est en cours d\'exécution.');
    }
    throw error;
  }
};

export const deleteReservation = async (idReserv: string) => {
  try {
    const response = await axios.delete(`${API_URL}/${idReserv}`);
    return response;
  } catch (error: any) {
    console.error(`Erreur suppression réservation ${idReserv}:`, error);
    if (error.response?.status === 502 || error.response?.status === 503) {
      throw new Error('Le serveur backend n\'est pas accessible. Vérifiez qu\'il est en cours d\'exécution.');
    }
    throw error;
  }
};

export const getDashboard = async (idVoit: string) => {
  try {
    const response = await axios.get<DashboardDTO>(`${API_URL}/dashboard/${idVoit}`);
    return response;
  } catch (error) {
    console.error(`Erreur dashboard voiture ${idVoit}:`, error);
    throw error;
  }
};

export const getSuiviVoyageurs = async (idVoit: string) => {
  try {
    const response = await axios.get<VoyageurDTO[]>(`${API_URL}/voyageurs/${idVoit}`);
    return { data: Array.isArray(response.data) ? response.data : [] };
  } catch (error) {
    console.error(`Erreur suivi voyageurs ${idVoit}:`, error);
    throw error;
  }
};

export const getRecu = async (idReserv: string) => {
  try {
    const response = await axios.get<RecuDTO>(`${API_URL}/recu/${idReserv}`);
    return response;
  } catch (error) {
    console.error(`Erreur recuperation recu ${idReserv}:`, error);
    throw error;
  }
};