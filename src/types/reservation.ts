import type { Client } from './client';
import type { Voiture } from './voiture';

export type PaymentType = 'SANS_AVANCE' | 'AVEC_AVANCE' | 'TOUT_PAYE';

export interface Reservation {
  idReserv?: string;
  voiture?: Voiture;
  client?: Client;
  place: number;
  dateVoyage: string;
  dateReserv?: string;
  payment: PaymentType;
  montantAvance: number;
}

export interface VoyageurDTO {
  idReserv: string;
  place: number;
  nomClient: string;
  numTel: string;
  statutPaiement: PaymentType;
  frais: number;
  montantAvance: number;
  resteAPayer: number;
}

export interface DashboardDTO {
  totalPassagers: number;
  totalToutPaye: number;
  totalResteAPayer: number;
}

export interface RecuDTO {
  idReserv: string;
  dateReserv: string;
  dateVoyage: string;
  nomClient: string;
  contact: string;
  idVoiture: string;
  typeVoiture: string;
  place: number;
  frais: number;
  payment: string;
  montantAvance: number;
  resteAPayer: number;
}