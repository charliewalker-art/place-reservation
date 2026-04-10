import React from 'react';
import { UserPlus, Pencil, X } from 'lucide-react';
import type { VoyageurDTO } from '../../../types/reservation';

interface FormHeaderProps {
  modeModification: boolean;
  reservationAModifier?: VoyageurDTO | null;
  onAnnuler: () => void;
}

const FormHeader: React.FC<FormHeaderProps> = ({
  modeModification,
  reservationAModifier,
  onAnnuler,
}) => (
  <div className="flex items-center justify-between gap-3 mb-8">
    <div className="flex items-center gap-3">
      <div className={`p-2.5 rounded-lg ${modeModification ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-700'}`}>
        {modeModification ? <Pencil size={22} /> : <UserPlus size={22} />}
      </div>
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          {modeModification ? 'Modifier la Réservation' : 'Nouvelle Réservation'}
        </h2>
        {modeModification && (
          <p className="text-xs text-amber-600 font-medium mt-0.5">
            Client : {reservationAModifier?.nomClient} — Place {reservationAModifier?.place}
          </p>
        )}
      </div>
    </div>
    {modeModification && (
      <button
        onClick={onAnnuler}
        className="p-2 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
        title="Annuler la modification"
      >
        <X size={18} />
      </button>
    )}
  </div>
);

export default FormHeader;