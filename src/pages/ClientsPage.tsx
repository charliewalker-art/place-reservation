import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { getClients, saveClient, deleteClient, updateClient } from '../api/clientService';
import type { Client } from '../types/client';

import { ClientHeader } from '../components/uiclient/ClientHeader'
import { ClientForm } from '../components/uiclient/ClientForm';
import { ClientList } from '../components/uiclient/ClientList';
import { DeleteConfirmModal } from '../components/uiclient/DeleteConfirmModal';

export const ClientsPage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [nom, setNom] = useState('');
  const [numTel, setNumTel] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  // État pour la modale de suppression
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await getClients();
      setClients(res.data);
    } catch (error) {
      toast.error("Impossible de charger la liste des clients.");
      console.error(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom || !numTel) return;

    try {
      if (editingId) {
        await updateClient(editingId, { nom, numTel });
        toast.success("Client mis à jour avec succès.");
      } else {
        await saveClient({ nom, numTel });
        toast.success("Nouveau client ajouté.");
      }
      resetForm();
      fetchClients();
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement.");
      console.error(error);
    }
  };

  const handleEdit = (client: Client) => {
    if (client.idCli) {
      setEditingId(client.idCli);
      setNom(client.nom);
      setNumTel(client.numTel);
    }
  };

  const openDeleteModal = (idCli: number) => {
    setClientToDelete(idCli);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!clientToDelete) return;
    try {
      await deleteClient(clientToDelete);
      toast.success("Client supprimé avec succès.");
      fetchClients();
    } catch (error) {
      toast.error("Erreur lors de la suppression.");
      console.error(error);
    } finally {
      setIsDeleteModalOpen(false);
      setClientToDelete(null);
    }
  };

  const resetForm = () => {
    setNom('');
    setNumTel('');
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-8 md:p-12 font-sans">
      <Toaster position="top-right" />
      
      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        onConfirm={confirmDelete} 
      />

      <div className="max-w-7xl mx-auto">
        <ClientHeader totalClients={clients.length} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <ClientForm 
              nom={nom}
              setNom={setNom}
              numTel={numTel}
              setNumTel={setNumTel}
              editingId={editingId}
              onSubmit={handleSubmit}
              onCancel={resetForm}
            />
          </div>

          <div className="lg:col-span-2">
            <ClientList 
              clients={clients}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onEdit={handleEdit}
              onDeleteClick={openDeleteModal}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientsPage;