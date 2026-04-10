import React from 'react';
import type { DashboardDTO } from '../../types/reservation';

interface StatsCardsProps {
  dashboard: DashboardDTO;
  recetteTotale: number; // Nouveau champ pour la recette
}

const StatsCards: React.FC<StatsCardsProps> = ({ dashboard, recetteTotale }) => {
  return (
    // On passe à 4 colonnes sur les grands écrans (lg:grid-cols-4)
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* Carte : Total Passagers */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 border-l-4 border-l-slate-400">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
          Total Passagers
        </p>
        <p className="text-3xl font-black text-slate-800">
          {String(dashboard.totalPassagers).padStart(2, '0')}
        </p>
      </div>

      {/* Carte : Tout Payé */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 border-l-4 border-l-emerald-500">
        <p className="text-[10px] font-bold uppercase text-slate-500 tracking-wider mb-1">
          Tout Payé
        </p>
        <p className="text-3xl font-black text-emerald-600">
          {String(dashboard.totalToutPaye).padStart(2, '0')}
        </p>
      </div>

      {/* Carte : Reste à Payer */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 border-l-4 border-l-red-500">
        <p className="text-[10px] font-bold uppercase text-slate-500 tracking-wider mb-1">
          Reste à Payer
        </p>
        <p className="text-3xl font-black text-red-600">
          {String(dashboard.totalResteAPayer).padStart(2, '0')}
        </p>
      </div>

      {/* NOUVELLE CARTE : Recette Totale */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 border-l-4 border-l-blue-600">
        <p className="text-[10px] font-bold uppercase text-slate-500 tracking-wider mb-1">
          Recette Totale
        </p>
        <p className="text-2xl font-black text-blue-600">
          {recetteTotale.toLocaleString()} <span className="text-[10px] font-bold text-slate-400">Ar</span>
        </p>
      </div>

    </div>
  );
};

export default StatsCards;