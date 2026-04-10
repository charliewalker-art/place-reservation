import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import type { Voiture } from '../../types/voiture';

interface VehicleCardActionsProps {
  voiture: Voiture;
  id: string | number | undefined;
  name: string;
  onEdit: (voiture: Voiture) => void;
  onDelete: (idVoit: string, designName: string) => void;
}

export const VehicleCardActions: React.FC<VehicleCardActionsProps> = ({ 
  voiture, 
  id, 
  name,
  onEdit, 
  onDelete 
}) => {
  return (
    <div className="flex gap-2">
      <button 
        onClick={() => onEdit(voiture)}
        title="Modifier"
        className="bg-green-100 hover:bg-green-200 text-green-600 p-2 rounded-xl transition-colors flex items-center justify-center"
      >
        <Edit2 size={16} />
      </button>
      <button 
        onClick={() => onDelete(id?.toString() || '', name)}
        title="Supprimer"
        className="bg-[#f0f2f9] hover:bg-red-100 text-red-500 p-3 rounded-xl transition-colors flex items-center justify-center"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};
