import React from 'react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6 transform transition-all">
        <h3 className="text-lg font-bold text-slate-900 mb-2">Confirmer la suppression</h3>
        <p className="text-slate-600 text-sm mb-6">
          Êtes-vous sûr de vouloir supprimer ce client ? Cette action est irréversible.
        </p>
        <div className="flex gap-3 justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-md text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            Annuler
          </button>
          <button 
            onClick={onConfirm}
            className="px-4 py-2 rounded-md text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
};