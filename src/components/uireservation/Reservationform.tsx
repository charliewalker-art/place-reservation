import React, { useState, useEffect } from 'react';
import { Search, User, Car, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast'; // Import de react-hot-toast
import type { Client } from '../../types/client';
import type { Voiture, Place } from '../../types/voiture';
import type { PaymentType, Reservation } from '../../types/reservation';
import { getVoitures, getAllPlacesByVoiture } from '../../api/voitureService';
import { searchClient } from '../../api/clientService';
import { createReservation } from '../../api/reservationservice';
import SeatGrid from './SeatGrid';

interface ReservationFormProps {
  onReservationCreated: (idVoit: string) => void;
  onVoitureSelected: (idVoit: string) => void;
}

const ReservationForm: React.FC<ReservationFormProps> = ({ onReservationCreated, onVoitureSelected }) => {
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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const placesLibres = places.filter((p) => p.occupation === 'LIBRE').length;
  const reste = selectedVoiture ? selectedVoiture.frais - montantAvance : 0;

  // Validation du formulaire
  const isFormValid = selectedVoiture !== null && selectedClient !== null && selectedPlace !== null && dateVoyage.trim() !== '';

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getVoitures();
        const voituresData = Array.isArray(res.data) ? res.data : [];
        setVoitures(voituresData);
        if (voituresData.length > 0) {
          await handleVoitureChange(voituresData[0].idVoit!, voituresData);
        }
      } catch (error: any) {
        setError(error.message || 'Impossible de charger les voitures.');
        setVoitures([]);
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);

  const handleVoitureChange = async (idVoit: string, voituresList?: Voiture[]) => {
    try {
      const list = voituresList ?? voitures;
      const voiture = list.find((v) => v.idVoit === idVoit) || null;
      setSelectedVoiture(voiture);
      setSelectedPlace(null);
      const res = await getAllPlacesByVoiture(idVoit);
      setPlaces(res.data);
      onVoitureSelected(idVoit);
    } catch (error: any) {
      setError(error.message || 'Impossible de charger les places de la voiture.');
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length >= 2) {
      try {
        const res = await searchClient(query);
        setClients(res.data);
        setShowClientList(true);
      } catch (error: any) {
        toast.error(error.message || 'Erreur lors de la recherche de clients.'); // Utilisation de toast
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

  const handleSubmit = async () => {
    if (!isFormValid) {
      toast.error('Veuillez remplir tous les champs obligatoires.'); // Utilisation de toast
      return;
    }

    const reservation: Reservation = {
      place: selectedPlace,
      dateVoyage,
      payment,
      montantAvance: payment === 'SANS_AVANCE' ? 0 : montantAvance,
    };

    try {
      await createReservation(selectedVoiture.idVoit!, selectedClient.idCli!, reservation);
      toast.success('Réservation enregistrée avec succès.'); // Ajout d'un toast de succès
      
      onReservationCreated(selectedVoiture.idVoit!);
      setSelectedPlace(null);
      setSelectedClient(null);
      setSearchQuery('');
      setMontantAvance(0);
      setPayment('SANS_AVANCE');
      const res = await getAllPlacesByVoiture(selectedVoiture.idVoit!);
      setPlaces(res.data);
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la création de la réservation.'); // Utilisation de toast
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 md:p-6 lg:p-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-blue-50 p-2.5 rounded-lg text-blue-700">
          <UserPlus size={22} />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Nouvelle Réservation</h2>
      </div>

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
          {/* Recherche Client */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Sélection du Client
            </label>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Rechercher par nom ou numéro..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 pl-11 pr-11 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
              <User className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              {showClientList && clients.length > 0 && (
                <div className="absolute z-10 w-full bg-white border border-slate-200 rounded-lg mt-1 shadow-lg">
                  {clients.map((c) => (
                    <div
                      key={c.idCli}
                      onClick={() => handleSelectClient(c)}
                      className="px-4 py-3 hover:bg-slate-50 cursor-pointer text-sm font-medium text-slate-700 border-b border-slate-100 last:border-0"
                    >
                      <div className="font-bold">{c.nom}</div>
                      <div className="text-slate-400 text-xs">{c.numTel}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Voiture et Places Libres */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Voiture
              </label>
              <select
                value={selectedVoiture?.idVoit || ''}
                onChange={(e) => handleVoitureChange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
              >
                {Array.isArray(voitures) && voitures.map((v) => (
                  <option key={v.idVoit} value={v.idVoit}>
                    {v.design} ({v.type})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Places Libres
              </label>
              <div className="w-full bg-blue-50 border border-blue-100 text-blue-700 font-bold rounded-lg py-3 px-4 flex justify-between items-center text-sm">
                <span>{placesLibres} / {selectedVoiture?.nbrPlace ?? 0}</span>
                <Car size={18} />
              </div>
            </div>
          </div>

          <SeatGrid
            places={places}
            selectedPlace={selectedPlace}
            onSelectPlace={setSelectedPlace}
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

          {/* Mode de Paiement */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Mode de Paiement
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              {(['SANS_AVANCE', 'AVEC_AVANCE', 'TOUT_PAYE'] as PaymentType[]).map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setPayment(p);
                    if (p === 'SANS_AVANCE') setMontantAvance(0);
                    if (p === 'TOUT_PAYE') setMontantAvance(selectedVoiture?.frais ?? 0);
                  }}
                  className={`flex-1 py-3 rounded-lg text-[11px] font-bold transition-colors ${
                    payment === p
                      ? 'border-2 border-blue-700 bg-white text-blue-700 shadow-sm'
                      : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {p.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Frais */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">
                Frais (Fixe)
              </label>
              <div className="bg-slate-100 py-3 px-3 rounded-lg text-sm font-bold text-slate-800 text-center">
                {selectedVoiture?.frais?.toLocaleString() ?? 0} Ar
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">
                Avance
              </label>
              <input
                type="number"
                value={montantAvance}
                disabled={payment !== 'AVEC_AVANCE'}
                onChange={(e) => setMontantAvance(Number(e.target.value))}
                className="w-full bg-slate-100 py-3 px-3 rounded-lg text-sm font-bold text-slate-800 text-center outline-none disabled:opacity-60"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">
                Reste
              </label>
              <div className="bg-emerald-100 text-emerald-700 py-3 px-3 rounded-lg text-sm font-bold text-center">
                {reste.toLocaleString()} Ar
              </div>
            </div>
          </div>

          {/* Bouton de soumission avec état désactivé */}
          <button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className={`w-full py-3 rounded-xl font-bold text-sm transition-all shadow-md ${
              isFormValid 
                ? 'bg-blue-700 text-white hover:bg-blue-800' 
                : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-70'
            }`}
          >
            Enregistrer la Réservation
          </button>
        </div>
      )}
    </div>
  );
};

export default ReservationForm;