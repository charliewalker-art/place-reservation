import axios from 'axios';
import type { Client } from '../types/client';

const BASE_URL = import.meta.env.VITE_API_URL || "/api";
const API_URL = `${BASE_URL}/client`;

export const saveClient = async (client: Client) => {
  return await axios.post(API_URL, client);
};

export const getClients = async () => {
  try {
    const response = await axios.get<Client[]>(API_URL);
    const data = response.data;
    const clientsList = Array.isArray(data) ? data : (data || []);
    return { data: clientsList };
  } catch (error) {
    console.error('Erreur API client:', error);
    // Retourner un array vide au lieu de throw
    return { data: [] };
  }
};




export const deleteClient = async (idCli: number) => {
  try {
    const response = await axios.delete(`${API_URL}/${idCli}`);
    return response;
  } catch (error) {
    console.error(`Erreur suppression client ${idCli}:`, error);
    throw error;
  }
};

export const updateClient = async (idCli: number, client: Client) => {
  try {
    const response = await axios.put(`${API_URL}/${idCli}`, client);
    return response;
  } catch (error) {
    console.error(`Erreur mise à jour client ${idCli}:`, error);
    throw error;
  }
};

  export const searchClient = async (query: string) => {
  try {
    const response = await axios.get<Client[]>(`${API_URL}/search?query=${query}`);
    return { data: Array.isArray(response.data) ? response.data : [] };
  } catch (error) {
    console.error('Erreur recherche client:', error);
    // Retourner un array vide au lieu de throw
    return { data: [] };
  }

}   ;