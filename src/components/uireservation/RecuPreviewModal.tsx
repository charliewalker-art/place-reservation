import React from 'react';
import { X, Printer, Download, Phone, Car } from 'lucide-react';
import type { RecuDTO } from '../../types/reservation';
import { generatePdf } from '../../utils/generatePdf';

interface RecuPreviewModalProps {
  recu: RecuDTO;
  onClose: () => void;
}

const RecuPreviewModal: React.FC<RecuPreviewModalProps> = ({ recu, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Actions Bar (Non imprimée) */}
        <div className="bg-slate-50 border-b border-slate-100 p-4 flex justify-between items-center print:hidden">
          <h3 className="font-bold text-slate-700">Prévisualisation du reçu</h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-200 rounded-full transition">
            <X size={20} />
          </button>
        </div>

        {/* Contenu du reçu (Zone imprimable) */}
        <div className="p-6 md:p-10 overflow-y-auto print:p-0 print:overflow-visible bg-white">
          
          {/* Header */}
          <div className="flex justify-between items-start mb-10">
            <div className="flex items-center gap-2">
              <div className="bg-blue-700 text-white p-2 rounded-lg">
                <span className="font-bold text-xl leading-none block">F</span>
              </div>
              <span className="font-bold text-xl text-slate-900 tracking-tight">FleetFlow Pro</span>
            </div>
            <div className="flex gap-4 print:hidden">
              <button onClick={handlePrint} className="text-slate-500 hover:text-slate-800 transition">
                <Printer size={20} />
              </button>
              <button onClick={() => generatePdf(recu)} className="text-slate-500 hover:text-slate-800 transition">
                <Download size={20} />
              </button>
            </div>
          </div>

          {/* Titre et Dates */}
          <div className="mb-10">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-4">
              REÇU DE RÉSERVATION N°{recu.idReserv}
            </h1>
            <div className="flex gap-12">
              <div>
                <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-1">Date réservation</p>
                <p className="text-sm font-medium text-slate-800">{recu.dateReserv || '-'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-1">Date voyage</p>
                <p className="text-sm font-bold text-blue-600">{recu.dateVoyage}</p>
              </div>
            </div>
          </div>

          {/* Cartes Informations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {/* Client */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Information Client</h3>
              <div className="mb-4">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Nom du passager</p>
                <p className="font-bold text-slate-900">{recu.nomClient}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Contact</p>
                <div className="flex items-center gap-2 font-medium text-slate-800">
                  <Phone size={14} className="text-blue-600" />
                  {recu.contact}
                </div>
              </div>
            </div>

            {/* Voyage */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Détails du voyage</h3>
              <div className="flex justify-between mb-4">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Véhicule</p>
                  <p className="font-bold text-slate-900">Voiture N°{recu.idVoiture}</p>
                </div>
                <div className="text-right">
               
            
                </div>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Siège</p>
                <div className="flex items-center gap-2 font-medium text-slate-800">
                  <Car size={14} className="text-blue-600" />
                  Place N°{recu.place}
                </div>
              </div>
            </div>
          </div>

          {/* Détails du paiement */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Détail du paiement</h3>
            <div className="bg-slate-50 rounded-xl border border-slate-100 overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100/50">
                  <tr>
                    <th className="py-3 px-6 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Désignation</th>
                    <th className="py-3 px-6 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Montant</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-4 px-6">
                      <p className="font-bold text-slate-900">Frais de transport</p>
                      <p className="text-xs text-slate-500">Trajet standard premium</p>
                    </td>
                    <td className="py-4 px-6 text-right font-medium text-slate-900">
                      {recu.frais.toLocaleString()} Ar
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6">
                      <p className="font-bold text-slate-900">Mode de paiement</p>
                      <p className="text-[10px] font-bold text-emerald-600 uppercase mt-1">{recu.payment.replace('_', ' ')}</p>
                    </td>
                    <td className="py-4 px-6 text-right text-slate-500">
                      - {recu.montantAvance.toLocaleString()} Ar
                    </td>
                  </tr>
                </tbody>
                <tfoot className="bg-blue-50/50">
                  <tr>
                    <td className="py-5 px-6 font-bold text-blue-700 uppercase tracking-wider text-sm">Reste à payer</td>
                    <td className="py-5 px-6 text-right font-extrabold text-blue-700 text-lg">
                      {recu.resteAPayer.toLocaleString()} Ar
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RecuPreviewModal;