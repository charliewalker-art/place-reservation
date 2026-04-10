import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  itemName: string;
  itemId: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  title,
  message,
  itemName,
  itemId,
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-4 sm:p-8 animate-in fade-in zoom-in duration-200">
        {/* Header avec icône */}
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-red-100 p-3 rounded-full">
            <AlertTriangle size={24} className="text-red-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{title}</h2>
            <p className="text-sm text-slate-500">Opération irréversible</p>
          </div>
          <button 
            onClick={onCancel}
            className="ml-auto text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Message */}
        <div className="mb-6 bg-slate-50 p-4 rounded-lg">
          <p className="text-slate-700 text-sm">{message}</p>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">ID:</span>
            <span className="text-sm font-mono bg-white px-3 py-1 rounded border border-slate-200 text-slate-700">
              {itemId}
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">NOM:</span>
            <span className="text-sm font-semibold text-slate-800 truncate">
              {itemName}
            </span>
          </div>
        </div>

        {/* Boutons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Suppression...
              </>
            ) : (
              'Supprimer'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
