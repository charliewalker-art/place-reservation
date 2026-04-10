import React from 'react';
import { Search, User } from 'lucide-react';
import type { Client } from '../../../types/client';

interface ClientSearchProps {
  searchQuery: string;
  clients: Client[];
  showClientList: boolean;
  onSearch: (query: string) => void;
  onSelectClient: (client: Client) => void;
}

const ClientSearch: React.FC<ClientSearchProps> = ({
  searchQuery,
  clients,
  showClientList,
  onSearch,
  onSelectClient,
}) => (
  <div>
    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
      Sélection du Client
    </label>
    <div className="relative">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Rechercher par nom ou numéro..."
        className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 pl-11 pr-11 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all"
      />
      <User className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
      {showClientList && clients.length > 0 && (
        <div className="absolute z-10 w-full bg-white border border-slate-200 rounded-lg mt-1 shadow-lg">
          {clients.map((c) => (
            <div
              key={c.idCli}
              onClick={() => onSelectClient(c)}
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
);

export default ClientSearch;