import React, { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import type { PaymentType } from '../../../types/reservation';

interface FraisPanelProps {
  frais: number;
  montantAvance: number;
  reste: number;
  payment: PaymentType;
  onMontantChange: (val: number) => void;
  onPaymentChange: (p: PaymentType) => void;
}

const FraisPanel: React.FC<FraisPanelProps> = ({
  frais,
  montantAvance,
  reste,
  payment,
  onMontantChange,
  onPaymentChange,
}) => {
  const avanceDepassee = payment === 'AVEC_AVANCE' && montantAvance > frais;

  useEffect(() => {
    if (frais <= 0) return;
    if (payment === 'AVEC_AVANCE' && montantAvance === frais) {
      onPaymentChange('TOUT_PAYE');
    } else if (payment === 'TOUT_PAYE' && montantAvance < frais) {
      onPaymentChange('AVEC_AVANCE');
    }
  }, [montantAvance, frais]);

  const handleChange = (val: number) => {
    if (val < 0)     return onMontantChange(0);
    if (val > frais) return onMontantChange(frais);
    onMontantChange(val);
  };

  return (
    <div className="space-y-2">
      <div className={`grid grid-cols-1 gap-4 pt-1 ${payment === 'TOUT_PAYE' ? 'sm:grid-cols-2' : 'sm:grid-cols-3'}`}>

        {/* Frais */}
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">
            Frais (Fixe)
          </label>
          <div className="bg-slate-100 py-3 px-3 rounded-lg text-sm font-bold text-slate-800 text-center">
            {frais.toLocaleString()} Ar
          </div>
        </div>

        {/* Avance — masquée si TOUT_PAYE */}
        {payment !== 'TOUT_PAYE' && (
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">
              Avance
            </label>
            <input
              type="number"
              value={montantAvance}
              disabled={payment !== 'AVEC_AVANCE'}
              min={0}
              max={frais}
              onChange={(e) => handleChange(Number(e.target.value))}
              className={`w-full py-3 px-3 rounded-lg text-sm font-bold text-center outline-none transition-all disabled:opacity-60
                ${avanceDepassee
                  ? 'bg-red-50 border-2 border-red-400 text-red-600'
                  : 'bg-slate-100 text-slate-800'
                }`}
            />
          </div>
        )}

        {/* Reste */}
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">
            Reste
          </label>
          <div className={`py-3 px-3 rounded-lg text-sm font-bold text-center transition-all
            ${reste === 0
              ? 'bg-emerald-100 text-emerald-700'
              : reste < 0
                ? 'bg-red-100 text-red-600'
                : 'bg-amber-50 text-amber-600'
            }`}
          >
            {reste.toLocaleString()} Ar
          </div>
        </div>
      </div>

      {/* Erreur dépassement */}
      {avanceDepassee && (
        <div className="flex items-center gap-2 text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          <AlertCircle size={15} className="shrink-0" />
          <p className="text-xs font-semibold">
            L'avance ne peut pas dépasser les frais ({frais.toLocaleString()} Ar).
          </p>
        </div>
      )}
    </div>
  );
};

export default FraisPanel;