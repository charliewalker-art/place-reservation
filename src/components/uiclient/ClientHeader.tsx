import React from 'react';
import { Users } from 'lucide-react';

interface ClientHeaderProps {
  totalClients: number;
}

export const ClientHeader: React.FC<ClientHeaderProps> = ({ totalClients }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Gestion des Clients</h1>
        <p className="text-slate-600 mt-2 text-sm">
          Centralisez vos relations clients et optimisez votre flux logistique.
        </p>
      </div>
      
      <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-100">
        <Users className="w-5 h-5 text-blue-600" />
        <div className="flex items-baseline gap-1">
          <span className="font-bold text-lg text-slate-900">{totalClients}</span>
          <span className="text-sm text-slate-500 font-medium">Clients enregistrés</span>
        </div>
      </div>
    </div>
  );
};