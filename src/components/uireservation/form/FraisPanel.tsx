import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
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
  const toutPayeAuto   = payment === 'TOUT_PAYE'   && montantAvance === frais;

  // ── Surveille montantAvance et bascule le mode automatiquement ──────────
  useEffect(() => {
    if (frais <= 0) return; // sécurité si frais pas encore chargé

    if (payment === 'AVEC_AVANCE' && montantAvance === frais) {
      // Avance complète → TOUT_PAYE
      onPaymentChange('TOUT_PAYE');
    } else if (payment === 'TOUT_PAYE' && montantAvance < frais) {
      // L'utilisateur a diminué l'avance → repasse en AVEC_AVANCE
      onPaymentChange('AVEC_AVANCE');
    }
  }, [montantAvance, frais]); // ← déclenché à chaque changement de montant

  const handleChange = (val: number) => {
    if (val < 0)     return onMontantChange(0);
    if (val > frais) return onMontantChange(frais); // plafond = frais
    onMontantChange(val);
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">

        {/* Frais */}
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">
            Frais (Fixe)
          </label>
          <div className="bg-slate-100 py-3 px-3 rounded-lg text-sm font-bold text-slate-800 text-center">
            {frais.toLocaleString()} Ar
          </div>
        </div>

        {/* Avance */}
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">
            Avance
          </label>
          <input
            type="number"
            value={montantAvance}
            disabled={payment !== 'AVEC_AVANCE' && payment !== 'TOUT_PAYE'}
            min={0}
            max={frais}
            onChange={(e) => handleChange(Number(e.target.value))}
            className={`w-full py-3 px-3 rounded-lg text-sm font-bold text-center outline-none transition-all disabled:opacity-60
              ${avanceDepassee
                ? 'bg-red-50 border-2 border-red-400 text-red-600'
                : toutPayeAuto
                  ? 'bg-emerald-50 border-2 border-emerald-400 text-emerald-700'
                  : 'bg-slate-100 text-slate-800'
              }`}
          />
        </div>

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

      {/* Succès auto-switch */}
      {toutPayeAuto && (
        <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
          <CheckCircle size={15} className="shrink-0" />
          <p className="text-xs font-semibold">
            Montant complet atteint — paiement automatiquement passé en <strong>TOUT PAYÉ</strong>.
          </p>
        </div>
      )}
    </div>
  );
};

export default FraisPanel;