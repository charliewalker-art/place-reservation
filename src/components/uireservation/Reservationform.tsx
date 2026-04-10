import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import type { Client } from '../../types/client';
import type { Voiture, Place } from '../../types/voiture';
import type { PaymentType, Reservation, VoyageurDTO } from '../../types/reservation';
import { getVoitures, getAllPlacesByVoiture } from '../../api/voitureService';
import { searchClient } from '../../api/clientService';
import { createReservation, updateReservation } from '../../api/reservationservice';

// Composants enfants
import SeatGrid from './SeatGrid';
import FormHeader from './form/FormHeader';
import ClientSearch from './form/ClientSearch';
import VoitureSelector from './form/VoitureSelector';
import PaymentSelector from './form/PaymentSelector';
import FraisPanel from './form/FraisPanel';

interface ReservationFormProps {
  onReservationCreated: (idVoit: string) => void;
  onVoitureSelected: (idVoit: string) => void;
  reservationAModifier?: VoyageurDTO | null;
  onAnnulerModification?: () => void;
}

const ReservationForm: React.FC<ReservationFormProps> = ({
  onReservationCreated,
  onVoitureSelected,
  reservationAModifier,
  onAnnulerModification,
}) => {
  const [voitures, setVoitures] = useState<Voiture[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVoiture, setSelectedVoiture] = useState<Voiture | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<number | null>(null);
  const [dateVoyage, setDateVoyage] = useState('');
  const [payment, setPayment] = useState<PaymentType>('SANS_AVANCE');
  const [montantAvance, setMontantAvance] = useState(0);
  const [showClientList, setShowClientList] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const modeModification = !!reservationAModifier;
  const placesLibres = places.filter((p) => p.occupation === 'LIBRE').length;
  const reste = selectedVoiture ? selectedVoiture.frais - montantAvance : 0;
  const isFormValid = modeModification
    ? selectedPlace !== null && dateVoyage.trim() !== ''
    : selectedVoiture !== null && selectedClient !== null && selectedPlace !== null && dateVoyage.trim() !== '';

  // ── Chargement initial ───────────────────────────────────────────────────
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const res = await getVoitures();
        const voituresData = Array.isArray(res.data) ? res.data : [];
        setVoitures(voituresData);
        if (voituresData.length > 0) {
          await handleVoitureChange(voituresData[0].idVoit!, voituresData);
        }
      } catch (e: any) {
        setError(e.message || 'Impossible de charger les voitures.');
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);

  // ── Pré-remplissage en mode modification ────────────────────────────────
  useEffect(() => {
    if (reservationAModifier) {
      setSelectedPlace(reservationAModifier.place);
      setPayment(reservationAModifier.statutPaiement as PaymentType);
      setSearchQuery(reservationAModifier.nomClient);
      if ((reservationAModifier as any).dateVoyage) {
        setDateVoyage((reservationAModifier as any).dateVoyage);
      }
      setMontantAvance(reservationAModifier.resteAPayer === 0 ? (selectedVoiture?.frais ?? 0) : 0);
    } else {
      resetForm();
    }
  }, [reservationAModifier]);

  const resetForm = () => {
    setSelectedPlace(null);
    setSelectedClient(null);
    setSearchQuery('');
    setMontantAvance(0);
    setPayment('SANS_AVANCE');
    setDateVoyage('');
  };

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleVoitureChange = async (idVoit: string, voituresList?: Voiture[]) => {
    try {
      const list = voituresList ?? voitures;
      setSelectedVoiture(list.find((v) => v.idVoit === idVoit) || null);
      setSelectedPlace(null);
      const res = await getAllPlacesByVoiture(idVoit);
      setPlaces(res.data);
      onVoitureSelected(idVoit);
    } catch (e: any) {
      setError(e.message || 'Impossible de charger les places.');
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length >= 2) {
      try {
        const res = await searchClient(query);
        setClients(res.data);
        setShowClientList(true);
      } catch (e: any) {
        toast.error(e.message || 'Erreur recherche client.');
        setShowClientList(false);
      }
    } else {
      setShowClientList(false);
    }
  };

  const handleSelectClient = (client: Client) => {
    setSelectedClient(client);
    setSearchQuery(client.nom);
    setShowClientList(false);
  };

  const handleMontantReset = (p: PaymentType, frais: number) => {
    if (p === 'SANS_AVANCE') setMontantAvance(0);
    if (p === 'TOUT_PAYE') setMontantAvance(frais);
  };

  const handleSubmit = async () => {
    if (!isFormValid) {
      toast.error('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    if (modeModification && reservationAModifier) {
      const updatedData: Partial<Reservation> = {
        place: selectedPlace ?? undefined,
        payment,
        montantAvance: payment === 'SANS_AVANCE' ? 0 : montantAvance,
        dateVoyage: dateVoyage || undefined,
      };
      try {
        await updateReservation(reservationAModifier.idReserv, updatedData);
        toast.success('Réservation modifiée avec succès.');
        onReservationCreated(selectedVoiture?.idVoit ?? '');
        onAnnulerModification?.();
        resetForm();
        if (selectedVoiture) {
          setPlaces((await getAllPlacesByVoiture(selectedVoiture.idVoit!)).data);
        }
      } catch (e: any) {
        toast.error(e.response?.data?.message || e.message || 'Erreur modification.');
      }
    } else {
      const reservation: Reservation = {
        place: selectedPlace ?? undefined,
        dateVoyage,
        payment,
        montantAvance: payment === 'SANS_AVANCE' ? 0 : montantAvance,
      };
      try {
        await createReservation(selectedVoiture!.idVoit!, selectedClient!.idCli!, reservation);
        toast.success('Réservation enregistrée avec succès.');
        onReservationCreated(selectedVoiture!.idVoit!);
        resetForm();
        setPlaces((await getAllPlacesByVoiture(selectedVoiture!.idVoit!)).data);
      } catch (e: any) {
        toast.error(e.message || 'Erreur création.');
      }
    }
  };

  // ── Rendu ────────────────────────────────────────────────────────────────
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 md:p-6 lg:p-8">

      <FormHeader
        modeModification={modeModification}
        reservationAModifier={reservationAModifier}
        onAnnuler={() => { onAnnulerModification?.(); resetForm(); }}
      />

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 font-medium">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-slate-500 font-medium">Chargement des données...</div>
        </div>
      ) : (
        <div className="space-y-6">

          {!modeModification && (
            <ClientSearch
              searchQuery={searchQuery}
              clients={clients}
              showClientList={showClientList}
              onSearch={handleSearch}
              onSelectClient={handleSelectClient}
            />
          )}

          {!modeModification && (
            <VoitureSelector
              voitures={voitures}
              selectedVoiture={selectedVoiture}
              placesLibres={placesLibres}
              onChange={handleVoitureChange}
            />
          )}

          <SeatGrid
            places={places}
            selectedPlace={selectedPlace}
            onSelectPlace={setSelectedPlace}
            currentReservationPlace={modeModification ? reservationAModifier?.place : undefined}
          />

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Date de Voyage
            </label>
            <input
              type="date"
              value={dateVoyage}
              onChange={(e) => setDateVoyage(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <PaymentSelector
            payment={payment}
            onChange={setPayment}
            onMontantReset={handleMontantReset}
            frais={selectedVoiture?.frais ?? 0}
          />

          <FraisPanel
            frais={selectedVoiture?.frais ?? 0}
            montantAvance={montantAvance}
            reste={reste}
            payment={payment}
            onMontantChange={setMontantAvance}
          />

          <button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className={`w-full py-3 rounded-xl font-bold text-sm transition-all shadow-md ${
              isFormValid
                ? modeModification
                  ? 'bg-amber-500 text-white hover:bg-amber-600'
                  : 'bg-blue-700 text-white hover:bg-blue-800'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-70'
            }`}
          >
            {modeModification ? 'Enregistrer les Modifications' : 'Enregistrer la Réservation'}
          </button>

        </div>
      )}
    </div>
  );
};

export default ReservationForm;