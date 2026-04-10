import React, { useState, useEffect } from 'react';
import { X, Armchair, Banknote } from 'lucide-react';
import type { Voiture, ServiceType } from '../../types/voiture';
import { ServiceOption } from './ServiceOption';

interface EditVoitureModalProps {
  isOpen: boolean;
  voiture: Voiture | null;
  onClose: () => void;
  onSave: (voiture: Voiture) => void;
  isLoading?: boolean;
}

export const EditVoitureModal: React.FC<EditVoitureModalProps> = ({
  isOpen,
  voiture,
  onClose,
  onSave,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<Voiture>({
    idVoit: '',
    design: '',
    type: 'simple',
    nbrPlace: 0,
    frais: 0,
  });

  useEffect(() => {
    if (voiture) {
      setFormData(voiture);
    }
  }, [voiture, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'frais') {
      const val = value.replace(/\D/g, '');
      setFormData((prev) => ({
        ...prev,
        [name]: Number(val),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = () => {
    if (!formData.design.trim()) {
      alert('La désignation est obligatoire');
      return;
    }
    if (formData.frais <= 0) {
      alert('Les frais doivent être supérieurs à 0');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 p-4 sm:p-8 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Modifier le Véhicule</h2>
            <p className="text-sm text-slate-500 mt-1">ID: {formData.idVoit}</p>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        {/* Formulaire */}
        <div className="space-y-6 mb-8">
          {/* Désignation */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-slate-500">Désignation</label>
            <input
              name="design"
              value={formData.design}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="Ex: Sprinter 2024"
              className="w-full rounded bg-slate-100 p-4 border focus:border-blue-500 outline-none disabled:opacity-50"
            />
          </div>

          {/* Frais */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-slate-500">Frais (Ar/jour)</label>
            <div className="relative">
              <Banknote
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={20}
              />
              <input
                name="frais"
                type="text"
                value={formData.frais || ''}
                onChange={handleChange}
                disabled={isLoading}
                placeholder="Saisir les frais"
                className="w-full rounded bg-slate-100 p-4 pl-12 border focus:border-blue-500 outline-none disabled:opacity-50"
              />
            </div>
          </div>

          {/* Type de Service */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase text-slate-500 block">Type de Service</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {(['simple', 'premium', 'VIP'] as ServiceType[]).map((t) => (
                <ServiceOption
                  key={t}
                  title={t}
                  desc={t === 'simple' ? 'Standard' : t === 'premium' ? 'Confort' : 'Luxe'}
                  selected={formData.type === t}
                  onClick={() => !isLoading && setFormData({ ...formData, type: t })}
                />
              ))}
            </div>
          </div>

          {/* Infos Non-Modifiables */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <p className="text-xs font-bold uppercase text-slate-500 mb-3">Informations non modifiables</p>
            <div className="flex items-center gap-2">
              <Armchair size={18} className="text-slate-400" />
              <span className="text-sm font-semibold text-slate-600">
                Nombre de places: <span className="text-slate-900">{formData.nbrPlace} places</span>
              </span>
            </div>
          </div>
        </div>

        {/* Boutons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-1 px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Mise à jour...
              </>
            ) : (
              'Enregistrer les modifications'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
