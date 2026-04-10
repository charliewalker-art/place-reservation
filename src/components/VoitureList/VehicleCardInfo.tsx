import React from 'react';
import { Users, Sparkles, ShieldCheck } from 'lucide-react';

interface VehicleCardInfoProps {
  id: string | number | undefined;
  name: string;
  capacity: number;
  type: string;
}

export const VehicleCardInfo: React.FC<VehicleCardInfoProps> = ({ 
  id, 
  name, 
  capacity,
  type 
}) => {
  const typeUpper = type ? type.toUpperCase() : 'SIMPLE';
  const badge = typeUpper;

  return (
    <>
      {/* Informations principales */}
      <div className="mb-4">
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">ID: {id || 'N/A'}</span>
        <h3 className="text-[22px] font-black text-slate-800 tracking-tighter leading-tight mt-1 truncate">{name}</h3>
      </div>

      {/* Blocs Capacité et Type */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <div className="bg-[#f8f9fc] p-3 rounded-2xl">
          <p className="text-[9px] uppercase font-bold text-slate-500 mb-1">Capacité</p>
          <p className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
            <Users size={14} className="text-blue-600"/> {capacity} Places
          </p>
        </div>
        <div className="bg-[#f8f9fc] p-3 rounded-2xl">
          <p className="text-[9px] uppercase font-bold text-slate-500 mb-1">Type</p>
          <p className="text-sm font-bold text-slate-700 flex items-center gap-1.5 truncate">
            {badge === 'VIP EXCLUSIVE' ? <ShieldCheck size={14} className="text-blue-600"/> : <Sparkles size={14} className="text-blue-600"/>} {typeUpper || 'STANDARD'}
          </p>
        </div>
      </div>
    </>
  );
};
