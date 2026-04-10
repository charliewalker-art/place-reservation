import React, { useEffect, useState, useCallback } from 'react';
import type { DashboardDTO, VoyageurDTO } from '../types/reservation';
import { getDashboard, getSuiviVoyageurs } from '../api/reservationservice';
import ReservationForm from '../components/uireservation/Reservationform';
import StatsCards from '../components/uireservation/StatsCards';
import VoyageursTable from '../components/uireservation/Voyageurstable';

const ReservationsPage: React.FC = () => {
  const [dashboard, setDashboard] = useState<DashboardDTO>({
    totalPassagers: 0,
    totalToutPaye: 0,
    totalResteAPayer: 0,
  });
  const [voyageurs, setVoyageurs] = useState<VoyageurDTO[]>([]);
  const [selectedVoiture, setSelectedVoiture] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // ← NOUVEAU : réservation en cours de modification
  const [reservationAModifier, setReservationAModifier] = useState<VoyageurDTO | null>(null);

  const loadData = useCallback(async (idVoit: string) => {
    if (!idVoit) return;
    try {
      setLoading(true);
      setError(null);
      const [dashRes, voyRes] = await Promise.all([
        getDashboard(idVoit),
        getSuiviVoyageurs(idVoit),
      ]);
      setDashboard(dashRes.data);
      setVoyageurs(voyRes.data);
    } catch (error: any) {
      console.error('Erreur chargement données:', error);
      setError(error.message || 'Impossible de charger les données.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedVoiture) loadData(selectedVoiture);
  }, [selectedVoiture, loadData]);

  // Déclenché depuis VoyageursTable quand on clique sur ✏️
  const handleModifier = (voyageur: VoyageurDTO) => {
    setReservationAModifier(voyageur);
    // Scroll vers le formulaire sur mobile
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans text-slate-800">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Gestion des Réservations
          </h1>
          <p className="text-slate-500 font-medium mt-1">Coopérative de Transport Centralisée</p>
        </div>
      </header>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 font-medium">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <ReservationForm
            onReservationCreated={(idVoit: string) => {
              setSelectedVoiture(idVoit);
              loadData(idVoit);
            }}
            onVoitureSelected={(idVoit: string) => {
              setSelectedVoiture(idVoit);
              loadData(idVoit);
            }}
            reservationAModifier={reservationAModifier}           // ← NOUVEAU
            onAnnulerModification={() => setReservationAModifier(null)} // ← NOUVEAU
          />
        </div>

        <div className="lg:col-span-7 space-y-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-slate-500 font-medium">Chargement des données...</div>
            </div>
          ) : (
            <>
              <StatsCards dashboard={dashboard} />
              <VoyageursTable
                voyageurs={voyageurs}
                onModifier={handleModifier} // ← NOUVEAU
                 onSupprimer={() => loadData(selectedVoiture)} // ← rafraîchit la liste
                
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservationsPage;