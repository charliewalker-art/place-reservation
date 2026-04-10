import { useState } from 'react';
import { VoitureList } from '../components/VoitureList';
import { VoitureForm } from '../components/VoitureForm';
import { Truck } from 'lucide-react';

export const VoituresPage = () => {
  const [view, setView] = useState<'LIST' | 'ADD'>('LIST');

  return (
    <div className="p-8">
      {view === 'LIST' ? (
        <VoitureList onAddClick={() => setView('ADD')} />
      ) : (
        <div className="max-w-4xl mx-auto">
          <header className="mb-8 flex items-start gap-4">
            <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
              <Truck size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Nouveau Véhicule</h1>
              <p className="text-slate-500 text-sm">Ajouter une unité à votre flotte FleetFlow Pro</p>
            </div>
          </header>

          <main>
            <button 
              onClick={() => setView('LIST')}
              className="mb-6 text-sm font-bold text-blue-600 flex items-center gap-2 hover:translate-x--4px transition-transform"
            >
              ← RETOUR À LA LISTE
            </button>
            <VoitureForm />
          </main>
        </div>
      )}
    </div>
  );
};
