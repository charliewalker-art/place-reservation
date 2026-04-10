import React, { useState } from 'react';
import { Armchair, Banknote } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast'; // Import de Toast
import type { Voiture, ServiceType } from '../types/voiture';
import { saveVoiture } from '../api/voitureService';
import { ServiceOption } from './VoitureForm/ServiceOption';


export const VoitureForm: React.FC = () => {
  const [formData, setFormData] = useState<Voiture>({
    idVoit  : '',
    design: '',
    type: 'simple',
    nbrPlace: 0,
    frais: 0
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Logique pour les champs numériques (Frais et Places)
    if (name === 'nbrPlace' || name === 'frais') {
      // On ne permet que les chiffres (regex)
      const val = value.replace(/\D/g, ''); 
      setFormData(prev => ({
        ...prev,
        [name]: Number(val)
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    // Validation : Empêcher le vide ou le 0 pour les frais
    if (formData.frais <= 0) {
      toast.error("Les frais doivent être supérieurs à 0");
      return;
    }

    if (!formData.design.trim()) {
      toast.error("La désignation est obligatoire");
      return;
    }

    try {
      await saveVoiture(formData);
      // Animation sympa de succès
      toast.success('Véhicule ajouté avec succès !', {
        duration: 4000,
        position: 'top-right',
      });
      
      // Optionnel : Reset le formulaire
      setFormData({ idVoit: '', design: '', type: 'simple', nbrPlace: 0, frais: 0 });
    } catch (error) {
      console.error(error);
      toast.error("Impossible de contacter le serveur");
    }
  };






  return (
    <div className="max-w-4xl mx-auto rounded-xl bg-white p-10 shadow-sm border border-slate-100">
      {/* Conteneur indispensable pour afficher les toasts */}
      <Toaster /> 

      <div className="grid grid-cols-2 gap-8 mb-8">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-slate-500">Désignation</label>
          <input 
            name="design" 
            value={formData.design} 
            onChange={handleChange} 
            placeholder="Ex: Sprinter 2024"
            className="w-full rounded bg-slate-100 p-4 border focus:border-blue-500 outline-none" 
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-slate-500">Places</label>
          <div className="relative">
            <Armchair className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              name="nbrPlace" 
              type="text" // Changé en text pour mieux contrôler la saisie via regex
              value={formData.nbrPlace || ''} 
              onChange={handleChange} 
              className="w-full rounded bg-slate-100 p-4 pl-12 border focus:border-blue-500 outline-none" 
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-slate-500">Frais (Valeur {'>'} 0)</label>
          <div className="relative">
            <Banknote className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              name="frais" 
              type="text" // Changé en text pour gérer la restriction numérique
              value={formData.frais || ''} 
              onChange={handleChange} 
              placeholder="Saisir les frais"
              className={`w-full rounded bg-slate-100 p-4 pl-12 border outline-none transition-all ${
                formData.frais === 0 ? 'focus:border-red-500' : 'focus:border-blue-500'
              }`} 
            />
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-12">
        <label className="text-xs font-bold uppercase text-slate-500 block">Type de Service</label>
        <div className="grid grid-cols-3 gap-4">
          {(['simple', 'premium', 'VIP'] as ServiceType[]).map((t) => (
            <ServiceOption 
              key={t}
              title={t} 
              desc={t === 'simple' ? 'Standard' : t === 'premium' ? 'Confort' : 'Luxe'} 
              selected={formData.type === t} 
              onClick={() => setFormData({...formData, type: t})}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-8">
      
        <button 
          onClick={handleSubmit} 
          className="rounded-lg bg-[#006b44] px-8 py-3 font-bold text-white hover:bg-[#005a39] shadow-md active:scale-95 transition-all"
        >
          Ajouter le véhicule
        </button>
      </div>
    </div>
  );
};