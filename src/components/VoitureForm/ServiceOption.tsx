import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface Props {
  title: string;
  desc: string;
  selected: boolean;
  onClick: () => void;
}

export const ServiceOption: React.FC<Props> = ({ title, desc, selected, onClick }) => (
  <div 
    onClick={onClick}
    className={`relative cursor-pointer rounded-lg border-2 p-6 transition-all ${
      selected ? 'border-blue-500 bg-blue-50' : 'border-transparent bg-slate-100 opacity-70'
    }`}
  >
    <h4 className="font-bold text-lg">{title.toUpperCase()}</h4>
    <p className="text-sm text-slate-500">{desc}</p>
    {selected && <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-600" size={24} />}
  </div>
);
