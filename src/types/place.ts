export type OccupationStatus = 'LIBRE' | 'OCCUPE';

export interface Place {
    id_voit: string; // id_voit dans votre entité
    placeNumber: number; // place dans votre entité
    occupation: OccupationStatus;
}