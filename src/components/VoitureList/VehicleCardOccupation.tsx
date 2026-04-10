import React from 'react';

interface VehicleCardOccupationProps {
  capacity: number;
  freePlaces: number;
  styles: {
    progress: string;
    occCenterText: string;
  };
}

export const VehicleCardOccupation: React.FC<VehicleCardOccupationProps> = ({ 
  capacity, 
  freePlaces,
  styles 
}) => {
  const occupied = capacity - freePlaces;
  const percentage = capacity > 0 ? (occupied / capacity) * 100 : 100;
  const isFull = capacity === 0 || freePlaces === 0;
  const halfFree = capacity > 0 ? freePlaces * 2 === capacity : false;
  const moreThanHalfFree = capacity > 0 ? freePlaces * 2 > capacity : false;

  let progressClass = styles.progress;
  let occCenterClass = styles.occCenterText;

  if (isFull) {
    progressClass = 'bg-red-600';
    occCenterClass = 'text-red-600';
  } else if (moreThanHalfFree) {
    progressClass = 'bg-green-600';
    occCenterClass = 'text-green-600';
  } else if (halfFree) {
    progressClass = 'bg-blue-600';
    occCenterClass = 'text-blue-600';
  } else {
    progressClass = 'bg-blue-500';
    occCenterClass = 'text-blue-500';
  }

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center text-[10px] font-black uppercase mb-3">
        <span className="text-slate-500 tracking-tight">Occupation</span>
        <span className={occCenterClass}>
          {isFull ? 'COMPLET' : `${occupied}/${capacity} occupés`}
        </span>
        <span className="px-2 py-0.5 rounded text-slate-600 bg-slate-50">
          {freePlaces} PLACES LIBRES
        </span>
      </div>
      <div className="w-full bg-slate-200 h-1.5 rounded-full">
        <div 
          className={`h-full rounded-full transition-all duration-700 ease-out ${progressClass}`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
