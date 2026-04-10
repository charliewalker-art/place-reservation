import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { getVoitures, deleteVoiture, updateVoiture } from '../api/voitureService';
import type { Voiture } from '../types/voiture';
import toast, { Toaster } from 'react-hot-toast';
import { DeleteConfirmModal } from './VoitureForm/DeleteConfirmModal';
import { EditVoitureModal } from './VoitureForm/EditVoitureModal';
import { VoitureListHeader } from './VoitureList/VoitureListHeader';
import { VehicleCard } from './VoitureList/VehicleCard';

interface VoitureListProps {
  onAddClick: () => void;
}

export const VoitureList: React.FC<VoitureListProps> = ({ onAddClick }) => {
  const [voitures, setVoitures] = useState<Voiture[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    idVoit: '',
    designName: '',
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [editModal, setEditModal] = useState({
    isOpen: false,
    voiture: null as Voiture | null,
  });
  const [isEditing, setIsEditing] = useState(false);

  const fetchVoitures = async () => {
    try {
      const response = await getVoitures();
      const voituresList = Array.isArray(response.data)
        ? response.data
        : (Array.isArray(response) ? response : []);

      setVoitures(voituresList);
    } catch (error: any) {
      const errorMessage = error.message || "Erreur lors de la récupération des véhicules";
      toast.error(errorMessage);
      console.error('Error fetching voitures:', error);
      // En cas d'erreur, s'assurer que voitures reste un array vide
      setVoitures([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVoitures();
  }, []);

  const handleDeleteVoiture = async (idVoit: string, designName: string) => {
    setDeleteModal({
      isOpen: true,
      idVoit,
      designName,
    });
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteVoiture(deleteModal.idVoit);
      toast.success(`Véhicule "${deleteModal.designName}" supprimé avec succès`, {
        duration: 4000,
        position: 'top-right',
      });
      await fetchVoitures();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Erreur lors de la suppression du véhicule";
      toast.error(errorMessage, {
        duration: 4000,
        position: 'top-right',
      });
    } finally {
      setIsDeleting(false);
      setDeleteModal({ isOpen: false, idVoit: '', designName: '' });
    }
  };

  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, idVoit: '', designName: '' });
  };

  const handleEditVoiture = (voiture: Voiture) => {
    setEditModal({
      isOpen: true,
      voiture,
    });
  };

  const closeEditModal = () => {
    setEditModal({
      isOpen: false,
      voiture: null,
    });
  };

  const saveEditVoiture = async (voiture: Voiture) => {
    setIsEditing(true);
    try {
      await updateVoiture(voiture.idVoit, voiture);
      toast.success(`Véhicule "${voiture.design}" modifié avec succès`, {
        duration: 4000,
        position: 'top-right',
      });
      await fetchVoitures();
      closeEditModal();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Erreur lors de la modification du véhicule";
      toast.error(errorMessage, {
        duration: 4000,
        position: 'top-right',
      });
      console.error('Erreur modification:', error);
    } finally {
      setIsEditing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 font-bold text-slate-400 animate-pulse uppercase tracking-widest">
        Chargement 
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-[#f4f6fb] min-h-screen">
      <Toaster />

      <DeleteConfirmModal 
        isOpen={deleteModal.isOpen}
        title="Supprimer le véhicule"
        message="Êtes-vous sûr de vouloir supprimer ce véhicule ? Cette action supprimera également toutes les places associées et ne peut pas être annulée."
        itemName={deleteModal.designName}
        itemId={deleteModal.idVoit}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        isLoading={isDeleting}
      />

      <EditVoitureModal
        isOpen={editModal.isOpen}
        voiture={editModal.voiture}
        onClose={closeEditModal}
        onSave={saveEditVoiture}
        isLoading={isEditing}
      />
      
      <VoitureListHeader 
        voituresCount={voitures.length}
        onAddClick={onAddClick}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(voitures) && voitures.map((v, index) => (
          <VehicleCard 
            key={v.idVoit || index}
            voiture={v}
            id={v.idVoit}
            name={v.design} 
            price={v.frais} 
            capacity={v.nbrPlace} 
            type={v.type}
            onEdit={handleEditVoiture}
            onDelete={handleDeleteVoiture}
          />
        ))}
        
        <div 
          onClick={onAddClick}
          className="border-2 border-dashed border-slate-300 rounded-3xl flex flex-col items-center justify-center p-12 hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer group bg-white/50"
        >
          <div className="bg-slate-100 group-hover:bg-blue-100 p-5 rounded-full text-slate-400 group-hover:text-blue-600 mb-4 transition-all group-hover:rotate-90 duration-300">
            <Plus size={32} />
          </div>
          <span className="font-bold text-slate-400 group-hover:text-blue-600 uppercase text-[10px] tracking-widest">Nouveau Véhicule</span>
        </div>
      </div>
    </div>
  );
};