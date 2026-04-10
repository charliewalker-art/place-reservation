import React, { useEffect, useState } from 'react';
import type { Voiture } from '../../types/voiture';
import { getCountPlacesLibres } from '../../api/placeService';
import { VehicleCardHeader } from './VehicleCardHeader';
import { VehicleCardInfo } from './VehicleCardInfo';
import { VehicleCardOccupation } from './VehicleCardOccupation';
import { VehicleCardActions } from './VehicleCardActions';

interface VehicleCardProps {
  voiture: Voiture;
  id?: string | number;
  name: string;
  price: number;
  capacity: number;
  type: string;
  onEdit: (voiture: Voiture) => void;
  onDelete: (idVoit: string, designName: string) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ 
  voiture, 
  id, 
  name, 
  price, 
  capacity, 
  type, 
  onEdit, 
  onDelete 
}) => {
  const [freePlaces, setFreePlaces] = useState<number>(capacity);
  
  const typeUpper = type ? type.toUpperCase() : 'SIMPLE';
  const badge = typeUpper;

  useEffect(() => {
    const fetchOccupation = async () => {
      if (!id) return;
      try {
        const count = await getCountPlacesLibres(id.toString());
        setFreePlaces(count);
      } catch (e) {
        setFreePlaces(capacity);
      }
    };
    fetchOccupation();
  }, [id, capacity]);

  // Configuration des styles dynamiques selon la capture d'écran
  const styleConfig = {
    PREMIUM: {
      border: 'border-blue-600 shadow-blue-100/50',
      iconBg: 'bg-blue-100 text-blue-600',
      badgeBg: 'bg-blue-600 text-white',
      progress: 'bg-blue-600',
      occCenterText: 'text-blue-600',
      occRightTag: 'text-slate-600 bg-slate-50',
    },
    VIP: {
      border: 'border-yellow-600 shadow-yellow-100/50',
      iconBg: 'bg-yellow-100 text-yellow-600',
      badgeBg: 'bg-yellow-600 text-white',
      progress: 'bg-yellow-600',
      occCenterText: 'text-yellow-600',
      occRightTag: 'text-slate-600 bg-slate-50',
    },
    SIMPLE: {
      border: 'border-gray-600 shadow-gray-100/50',
      iconBg: 'bg-gray-100 text-gray-600',
      badgeBg: 'bg-gray-600 text-white',
      progress: 'bg-gray-600',
      occCenterText: 'text-gray-600',
      occRightTag: 'text-slate-600 bg-slate-50',
    }
  };

  const styles = styleConfig[badge as keyof typeof styleConfig];

  return (
    <div className={`bg-white rounded-4xl p-6 border-2 transition-all duration-300 hover:shadow-xl ${styles.border}`}>
      <VehicleCardHeader 
        capacity={capacity}
        type={type}
        price={price}
        styles={{
          iconBg: styles.iconBg,
          badgeBg: styles.badgeBg,
        }}
      />
      
      <VehicleCardInfo 
        id={id}
        name={name}
        capacity={capacity}
        type={type}
      />

      <VehicleCardOccupation 
        capacity={capacity}
        freePlaces={freePlaces}
        styles={{
          progress: styles.progress,
          occCenterText: styles.occCenterText,
        }}
      />

      <VehicleCardActions 
        voiture={voiture}
        id={id}
        name={name}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
};
