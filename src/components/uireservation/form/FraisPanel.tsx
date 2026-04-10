import React from 'react';
import type { PaymentType } from '../../../types/reservation';

interface FraisPanelProps {
  frais: number;
  montantAvance: number;
  reste: number;
  payment: PaymentType;
  onMontantChange: (val: number) => void;
}

const FraisPanel: React.FC<FraisPanelProps> = ({
  frais,
  montantAvance,
  reste,
  payment,
  onMontantChange,
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
    <div>
      <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Frais (Fixe)</label>
      <div className="bg-slate-100 py-3 px-3 rounded-lg text-sm font-bold text-slate-800 text-center">
        {frais.toLocaleString()} Ar
      </div>
    </div>
    <div>
      <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Avance</label>
      <input
        type="number"
        value={montantAvance}
        disabled={payment !== 'AVEC_AVANCE'}
        onChange={(e) => onMontantChange(Number(e.target.value))}
        className="w-full bg-slate-100 py-3 px-3 rounded-lg text-sm font-bold text-slate-800 text-center outline-none disabled:opacity-60"
      />
    </div>
    <div>
      <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Reste</label>
      <div className="bg-emerald-100 text-emerald-700 py-3 px-3 rounded-lg text-sm font-bold text-center">
        {reste.toLocaleString()} Ar
      </div>
    </div>
  </div>
);

export default FraisPanel;