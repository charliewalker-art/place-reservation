import React from 'react';
import { Bus, Car } from 'lucide-react';

interface VehicleCardHeaderProps {
  capacity: number;
  type: string;
  price: number;
  styles: {
    iconBg: string;
    badgeBg: string;
  };
}

export const VehicleCardHeader: React.FC<VehicleCardHeaderProps> = ({ 
  capacity, 
  type, 
  price,
  styles 
}) => {
  const typeUpper = type ? type.toUpperCase() : 'SIMPLE';
  const badge = typeUpper;

  return (
    <div className="flex justify-between items-start mb-6">
      <div className={`p-3 rounded-2xl ${styles.iconBg}`}>
        {capacity > 15 ? <Bus size={24} /> : <Car size={24} />}
      </div>
      <div className="flex flex-col items-end">
        <span className={`px-4 py-1 rounded-full text-[9px] font-black tracking-wider uppercase mb-1 ${styles.badgeBg}`}>
          {badge}
        </span>
        <div className="flex items-baseline">
          <span className="text-[22px] font-black text-teal-600">{price.toFixed(2)}</span>
          <span className="text-[11px] font-bold text-teal-600 ml-0.5">AR</span>
        </div>
      </div>
    </div>
  );
};
