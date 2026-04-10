export type ServiceType = 'simple' | 'premium' | 'VIP';

export interface Place {
  idPlace?: string;
  place: number;
  occupation: 'LIBRE' | 'RESERVEE' | 'OCCUPE';
  voiture?: Voiture;
}

export interface Voiture {
  idVoit: string;
  design: string;
  type: ServiceType;
  nbrPlace: number;
  frais: number;
  places?: Place[];
}