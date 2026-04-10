import React from 'react';
import { Plus } from 'lucide-react';

interface VoitureListHeaderProps {
  voituresCount: number;
  onAddClick: () => void;
}

export const VoitureListHeader: React.FC<VoitureListHeaderProps> = ({ voituresCount, onAddClick }) => {
  return (
    <>
      <div className="flex justify-between items-end mb-10">
      <div>
      </div>
      <button 
        onClick={onAddClick}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-95 text-sm"
      >
        <Plus size={20} /> AJOUTER UN VÉHICULE
      </button>
      </div>

      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Liste des Véhicules ({voituresCount})</h2>
        <div className="flex gap-2">

    
        </div>
      </div>
    </>
  );
};
