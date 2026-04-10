import React from 'react';
import { Car } from 'lucide-react';
import type { Voiture } from '../../../types/voiture';

interface VoitureSelectorProps {
  voitures: Voiture[];
  selectedVoiture: Voiture | null;
  placesLibres: number;
  onChange: (idVoit: string) => void;
}

const VoitureSelector: React.FC<VoitureSelectorProps> = ({
  voitures,
  selectedVoiture,
  placesLibres,
  onChange,
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div>
      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
        Voiture
      </label>
      <select
        value={selectedVoiture?.idVoit || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
      >
        {voitures.map((v) => (
          <option key={v.idVoit} value={v.idVoit}>
            {v.design} ({v.type})
          </option>
        ))}
      </select>
    </div>
    <div>
      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
        Places Libres
      </label>
      <div className="w-full bg-blue-50 border border-blue-100 text-blue-700 font-bold rounded-lg py-3 px-4 flex justify-between items-center text-sm">
        <span>{placesLibres} / {selectedVoiture?.nbrPlace ?? 0}</span>
        <Car size={18} />
      </div>
    </div>
  </div>
);

export default VoitureSelector;