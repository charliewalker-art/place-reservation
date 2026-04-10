import React from 'react';
import { Search, Pencil, Trash2 } from 'lucide-react';
import type { Client } from '../../types/client';

interface ClientListProps {
  clients: Client[];
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  onEdit: (client: Client) => void;
  onDeleteClick: (id: number) => void;
}

const getInitials = (name: string) => {
  if (!name) return '';
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
};

const getAvatarColor = (id?: number) => {
  const colors = [
    'bg-indigo-100 text-indigo-700',
    'bg-emerald-100 text-emerald-700',
    'bg-slate-200 text-slate-700',
    'bg-gray-200 text-gray-700',
    'bg-blue-100 text-blue-700'
  ];
  return colors[(id || 0) % colors.length];
};

export const ClientList: React.FC<ClientListProps> = ({ 
  clients, searchTerm, setSearchTerm, onEdit, onDeleteClick 
}) => {
  const filteredClients = clients.filter(c => 
    c.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.numTel.includes(searchTerm)
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full">
      <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100">
        <h2 className="text-xl font-bold text-slate-900">Répertoire Clients</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher un client..." 
            className="pl-9 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm w-full sm:w-64 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
      </div>

      <div className="flex-1">
        <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-slate-50 text-xs font-bold text-slate-500 tracking-wider uppercase">
          <div className="col-span-6">Client</div>
          <div className="col-span-4">Téléphone</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredClients.map((client) => (
            <div key={client.idCli} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50/50 transition-colors">
              <div className="col-span-6 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${getAvatarColor(client.idCli)}`}>
                  {getInitials(client.nom)}
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">{client.nom}</p>
                  <p className="text-xs text-slate-400 mt-0.5">ID: {client.idCli}</p>
                </div>
              </div>
              
              <div className="col-span-4 text-sm text-slate-600 font-medium">
                {client.numTel}
              </div>

              <div className="col-span-2 flex items-center justify-end gap-3">
                <button 
                  onClick={() => onEdit(client)}
                  className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => client.idCli && onDeleteClick(client.idCli)}
                  className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          
          {filteredClients.length === 0 && (
            <div className="p-8 text-center text-slate-500">
              Aucun client trouvé.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};