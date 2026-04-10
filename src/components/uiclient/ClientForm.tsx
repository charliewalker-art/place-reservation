import React from 'react';

interface ClientFormProps {
  nom: string;
  setNom: (val: string) => void;
  numTel: string;
  setNumTel: (val: string) => void;
  editingId: number | null;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export const ClientForm: React.FC<ClientFormProps> = ({
  nom, setNom, numTel, setNumTel, editingId, onSubmit, onCancel
}) => {
  return (
    <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-100">
      <h2 className="text-xl font-bold text-slate-900 mb-2">
        {editingId ? "Modifier Client" : "Nouveau Client"}
      </h2>
      <p className="text-slate-500 text-sm mb-8">
        Saisissez les informations essentielles pour l'enregistrement.
      </p>

      <form className="space-y-6" onSubmit={onSubmit}>
        <div>
          <label className="block text-xs font-bold text-slate-600 tracking-wider mb-2 uppercase">
            Nom Complet
          </label>
          <input 
            type="text" 
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            placeholder="Ex: Jean Dupont" 
            required
            className="w-full bg-slate-100 text-slate-900 placeholder-slate-400 border-none rounded-md px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 tracking-wider mb-2 uppercase">
            Numéro de téléphone
          </label>
          <input 
            type="text" 
            value={numTel}
            onChange={(e) => setNumTel(e.target.value)}
            placeholder="+261 34 00 000 00" 
            required
            className="w-full bg-slate-100 text-slate-900 placeholder-slate-400 border-none rounded-md px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-4 pt-4">
          <button type="submit" className="flex-1 bg-[#1048E5] hover:bg-blue-700 text-white py-3 rounded-md font-semibold text-sm transition-all">
            {editingId ? "Mettre à jour" : "Ajouter le client"}
          </button>
          
          {/* Condition : Afficher "Annuler" uniquement en mode modification */}
          {editingId && (
            <button 
              type="button" 
              onClick={onCancel}
              className="px-4 py-3 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-all"
            >
              Annuler
            </button>
          )}
        </div>
      </form>
    </div>
  );
};