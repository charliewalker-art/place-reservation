import React from 'react';
import type { PaymentType } from '../../../types/reservation';

interface PaymentSelectorProps {
  payment: PaymentType;
  onChange: (p: PaymentType) => void;
  onMontantReset: (p: PaymentType, frais: number) => void;
  frais: number;
}

const PAYMENT_OPTIONS: PaymentType[] = ['SANS_AVANCE', 'AVEC_AVANCE', 'TOUT_PAYE'];

const PaymentSelector: React.FC<PaymentSelectorProps> = ({
  payment,
  onChange,
  onMontantReset,
  frais,
}) => (
  <div>
    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
      Mode de Paiement
    </label>
    <div className="flex flex-col sm:flex-row gap-3">
      {PAYMENT_OPTIONS.map((p) => (
        <button
          key={p}
          onClick={() => {
            onChange(p);
            onMontantReset(p, frais);
          }}
          className={`flex-1 py-3 rounded-lg text-[11px] font-bold transition-colors ${
            payment === p
              ? 'border-2 border-blue-700 bg-white text-blue-700 shadow-sm'
              : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
          }`}
        >
          {p.replace(/_/g, ' ')}
        </button>
      ))}
    </div>
  </div>
);

export default PaymentSelector;