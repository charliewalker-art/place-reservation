import React, { useState } from 'react';
import { Search, User, ChevronLeft, ChevronRight, FileText, Eye, Pencil, Trash2, AlertTriangle } from 'lucide-react';
import type { VoyageurDTO, RecuDTO } from '../../types/reservation';
import { getRecu, deleteReservation } from '../../api/reservationservice';
import { generatePdf } from '../../utils/generatePdf';
import RecuPreviewModal from './RecuPreviewModal';
import toast from 'react-hot-toast';

interface VoyageursTableProps {
  voyageurs: VoyageurDTO[];
  onModifier: (voyageur: VoyageurDTO) => void;
  onSupprimer: () => void; // ← pour rafraîchir après suppression
}

// ── Boîte de dialogue de confirmation ───────────────────────────────────────
interface ConfirmDialogProps {
  voyageur: VoyageurDTO;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ voyageur, onConfirm, onCancel, loading }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    {/* Overlay */}
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />

    {/* Boîte */}
    <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 w-full max-w-sm mx-4 animate-in fade-in zoom-in-95">
      {/* Icône */}
      <div className="flex justify-center mb-4">
        <div className="bg-red-100 p-3 rounded-full">
          <AlertTriangle size={28} className="text-red-500" />
        </div>
      </div>

      {/* Texte */}
      <h3 className="text-lg font-extrabold text-slate-900 text-center mb-1">
        Confirmer la suppression
      </h3>
      <p className="text-sm text-slate-500 text-center mb-1">
        Voulez-vous vraiment supprimer la réservation de
      </p>
      <p className="text-sm font-bold text-slate-800 text-center mb-1">
        {voyageur.nomClient}
      </p>
      <p className="text-xs text-slate-400 text-center mb-6">
        Place {voyageur.place < 10 ? `0${voyageur.place}` : voyageur.place} — {voyageur.numTel}
      </p>

      {/* Boutons */}
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          disabled={loading}
          className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors disabled:opacity-50"
        >
          Annuler
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Trash2 size={15} />
          )}
          Supprimer
        </button>
      </div>
    </div>
  </div>
);

// ── Composant principal ──────────────────────────────────────────────────────
const ITEMS_PER_PAGE = 4;

const VoyageursTable: React.FC<VoyageursTableProps> = ({ voyageurs, onModifier, onSupprimer }) => {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('tous');
  const [page, setPage] = useState(0);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [previewRecu, setPreviewRecu] = useState<RecuDTO | null>(null);

  // État pour la confirmation de suppression
  const [voyageurASupprimer, setVoyageurASupprimer] = useState<VoyageurDTO | null>(null);
  const [suppressionEnCours, setSuppressionEnCours] = useState(false);

  const filtered = voyageurs.filter((v) => {
    const matchSearch =
      v.nomClient.toLowerCase().includes(search.toLowerCase()) ||
      v.numTel.includes(search);
    const matchStatus =
      filterStatus === 'tous' ||
      (filterStatus === 'paye' && v.statutPaiement === 'TOUT_PAYE') ||
      (filterStatus === 'reste' && v.statutPaiement !== 'TOUT_PAYE');
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

  const getStatusStyle = (status: string) =>
    status === 'TOUT_PAYE' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600';

  const getStatusLabel = (status: string) =>
    status === 'TOUT_PAYE' ? 'TOUT PAYÉ' : 'RESTE À PAYER';

  const handlePreview = async (idReserv: string) => {
    try {
      setLoadingAction(`view-${idReserv}`);
      const res = await getRecu(idReserv);
      setPreviewRecu(res.data);
    } catch {
      toast.error('Erreur lors du chargement du reçu.');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleGeneratePdf = async (idReserv: string) => {
    try {
      setLoadingAction(`download-${idReserv}`);
      const res = await getRecu(idReserv);
      generatePdf(res.data);
    } catch {
      toast.error('Erreur lors de la génération du PDF.');
    } finally {
      setLoadingAction(null);
    }
  };

  // ── Suppression confirmée ──────────────────────────────────────────────
  const handleConfirmerSuppression = async () => {
    if (!voyageurASupprimer) return;
    try {
      setSuppressionEnCours(true);
      await deleteReservation(voyageurASupprimer.idReserv);
      toast.success(`Réservation de ${voyageurASupprimer.nomClient} supprimée.`);
      setVoyageurASupprimer(null);
      onSupprimer(); // rafraîchit la liste dans le parent
    } catch (e: any) {
      toast.error(e.message || 'Erreur lors de la suppression.');
    } finally {
      setSuppressionEnCours(false);
    }
  };

  return (
    <>
      {/* Dialog de confirmation */}
      {voyageurASupprimer && (
        <ConfirmDialog
          voyageur={voyageurASupprimer}
          onConfirm={handleConfirmerSuppression}
          onCancel={() => setVoyageurASupprimer(null)}
          loading={suppressionEnCours}
        />
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-4 md:p-6 flex flex-col lg:flex-row justify-between items-start lg:items-center border-b border-slate-100 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-50 p-2.5 rounded-lg text-emerald-600">
              <User size={22} />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Suivi des Voyageurs</h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Filtrer..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-9 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => { setFilterStatus(e.target.value); setPage(0); }}
              className="bg-slate-100 border-none rounded-lg py-2 px-4 text-sm font-bold text-slate-700 outline-none cursor-pointer w-full sm:w-auto"
            >
              <option value="tous">Tous les statuts</option>
              <option value="paye">Tout Payé</option>
              <option value="reste">Reste à Payer</option>
            </select>
          </div>
        </div>

        {/* Tableau */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-150">
            <thead>
              <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 bg-slate-50/50">
                <th className="px-4 py-4 md:px-6">Place</th>
                <th className="px-4 py-4 md:px-6">Client / Contact</th>
                <th className="px-4 py-4 md:px-6 text-center">Statut Paiement</th>
                <th className="px-4 py-4 md:px-6 text-right">Reste</th>
                <th className="px-4 py-4 md:px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-400 font-medium text-sm">
                    Aucun voyageur trouvé
                  </td>
                </tr>
              ) : (
                paginated.map((v, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-4 md:px-6">
                      <span className="bg-slate-100 text-slate-600 font-bold px-3 py-1.5 rounded-lg text-xs">
                        {v.place < 10 ? `0${v.place}` : v.place}
                      </span>
                    </td>
                    <td className="px-4 py-4 md:px-6">
                      <div className="font-bold text-slate-800">{v.nomClient}</div>
                      <div className="text-[11px] text-slate-500 font-medium mt-0.5">{v.numTel}</div>
                    </td>
                    <td className="px-4 py-4 md:px-6 text-center">
                      <span className={`text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider whitespace-nowrap ${getStatusStyle(v.statutPaiement)}`}>
                        {getStatusLabel(v.statutPaiement)}
                      </span>
                    </td>
                    <td className="px-4 py-4 md:px-6 text-right font-bold text-slate-800 whitespace-nowrap">
                      {v.resteAPayer.toLocaleString()} Ar
                    </td>
                    <td className="px-4 py-4 md:px-6">
                      <div className="flex items-center justify-center gap-2">
                        {/* Modifier */}
                        <button
                          onClick={() => onModifier(v)}
                          title="Modifier la réservation"
                          className="p-2 bg-amber-50 text-amber-600 border border-amber-100 rounded-lg hover:bg-amber-100 transition-colors"
                        >
                          <Pencil size={16} />
                        </button>
                        {/* Voir reçu */}
                        <button
                          onClick={() => handlePreview(v.idReserv)}
                          disabled={loadingAction === `view-${v.idReserv}`}
                          title="Voir le reçu"
                          className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50"
                        >
                          <Eye size={16} />
                        </button>
                        {/* Télécharger PDF */}
                        <button
                          onClick={() => handleGeneratePdf(v.idReserv)}
                          disabled={loadingAction === `download-${v.idReserv}`}
                          title="Télécharger PDF"
                          className="p-2 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
                        >
                          <FileText size={16} />
                        </button>
                        {/* Supprimer ← NOUVEAU */}
                        <button
                          onClick={() => setVoyageurASupprimer(v)}
                          title="Supprimer la réservation"
                          className="p-2 bg-red-50 text-red-500 border border-red-100 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 flex justify-between items-center border-t border-slate-100 bg-white">
          <p className="text-xs font-bold text-slate-500">
            Affichage de {paginated.length} sur {filtered.length}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="p-1.5 border border-slate-200 rounded-md text-slate-400 hover:bg-slate-50 transition-colors disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="p-1.5 border border-slate-200 rounded-md text-slate-400 hover:bg-slate-50 transition-colors disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {previewRecu && (
          <RecuPreviewModal recu={previewRecu} onClose={() => setPreviewRecu(null)} />
        )}
      </div>
    </>
  );
};

export default VoyageursTable;