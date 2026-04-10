import React from 'react';
import { Car } from 'lucide-react';
import type { Place } from '../../types/voiture';

interface SeatGridProps {
  places: Place[];
  selectedPlace: number | null;
  onSelectPlace: (num: number) => void;
  currentReservationPlace?: number; // ← NOUVEAU : place actuelle en mode modif
}

const SeatGrid: React.FC<SeatGridProps> = ({
  places,
  selectedPlace,
  onSelectPlace,
  currentReservationPlace,
}) => {
  const getPlaceStatus = (num: number): 'LIBRE' | 'OCCUPE' | 'SELECTED' => {
    if (selectedPlace === num) return 'SELECTED';
    const found = places.find((p) => p.place === num);
    if (!found) return 'LIBRE';
    // La place actuelle de la réservation doit rester cliquable
    if (found.occupation === 'OCCUPE' && num === currentReservationPlace) return 'LIBRE';
    return found.occupation === 'OCCUPE' ? 'OCCUPE' : 'LIBRE';
  };

  const getSeatStyle = (status: 'LIBRE' | 'OCCUPE' | 'SELECTED') => {
    switch (status) {
      case 'SELECTED':
        return 'bg-blue-700 border-blue-700 text-white shadow-md';
      case 'OCCUPE':
        return 'bg-red-50 border-red-200 text-red-400 cursor-not-allowed';
      default:
        return 'bg-white border-slate-200 text-slate-700 hover:border-blue-400 cursor-pointer';
    }
  };

  return (
    <div>
      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
        Choix de la Place
      </label>
      <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-1 bg-slate-200 rounded-lg h-11 flex items-center justify-center text-slate-400">
            <Car size={20} />
          </div>
          <div className="col-span-2" />
          {places.map((p) => {
            const status = getPlaceStatus(p.place);
            return (
              <button
                key={p.place}
                disabled={status === 'OCCUPE'}
                onClick={() => status !== 'OCCUPE' && onSelectPlace(p.place)}
                className={`h-11 rounded-lg border font-bold text-sm transition-all flex items-center justify-center ${getSeatStyle(status)}`}
              >
                {p.place < 10 ? `0${p.place}` : p.place}
              </button>
            );
          })}
        </div>
        <div className="flex gap-5 mt-5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full border-2 border-slate-300 bg-white" />Libre
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-700" />Sélection
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-200" />Occupé
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatGrid;