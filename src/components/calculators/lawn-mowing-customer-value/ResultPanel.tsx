import React from 'react';
import { DollarSign, TrendingUp, Users, Target } from 'lucide-react';

interface ResultPanelProps {
  title: string;
  value: string;
  info: string;
  type?: 'lifetime' | 'yearly' | 'total' | 'target';
}

export const ResultPanel: React.FC<ResultPanelProps> = ({ title, value, info, type = 'lifetime' }) => {
  const getPanelStyle = () => {
    switch (type) {
      case 'lifetime':
        return {
          background: 'bg-gradient-to-r from-[rgba(181,118,20,0.1)] to-[rgba(14,192,124,0.1)]',
          border: 'border-[rgba(181,118,20,0.6)]',
          icon: <DollarSign className="w-6 h-6" style={{ color: 'rgb(181, 118, 20)' }} />
        };
      case 'yearly':
        return {
          background: 'bg-gradient-to-r from-[rgba(14,192,124,0.1)] to-[rgba(104,157,106,0.1)]',
          border: 'border-[rgba(14,192,124,0.6)]',
          icon: <TrendingUp className="w-6 h-6" style={{ color: 'rgb(14, 192, 124)' }} />
        };
      case 'total':
        return {
          background: 'bg-gradient-to-r from-[rgba(104,157,106,0.1)] to-[rgba(181,118,20,0.1)]',
          border: 'border-[rgba(104,157,106,0.6)]',
          icon: <Users className="w-6 h-6" style={{ color: 'rgb(104, 157, 106)' }} />
        };
      case 'target':
        return {
          background: 'bg-gradient-to-r from-[rgba(80,73,69,0.1)] to-[rgba(14,192,124,0.1)]',
          border: 'border-[rgba(80,73,69,0.6)]',
          icon: <Target className="w-6 h-6" style={{ color: 'rgb(80, 73, 69)' }} />
        };
      default:
        return {
          background: 'bg-gradient-to-r from-[rgba(181,118,20,0.1)] to-[rgba(14,192,124,0.1)]',
          border: 'border-[rgba(181,118,20,0.6)]',
          icon: <DollarSign className="w-6 h-6" style={{ color: 'rgb(181, 118, 20)' }} />
        };
    }
  };

  const style = getPanelStyle();

  return (
    <div className={`p-6 rounded-lg shadow-lg ${style.background} border ${style.border}`}>
      <div className="flex items-center gap-3 mb-2">
        {style.icon}
        <h3 className="text-base font-semibold" style={{ color: 'rgb(80, 73, 69)' }}>{title}</h3>
      </div>
      <p className="text-3xl font-bold mt-2" style={{ color: 'rgb(181, 118, 20)' }}>{value}</p>
      <p className="text-sm mt-2" style={{ color: 'rgba(80, 73, 69, 0.8)' }}>{info}</p>
    </div>
  );
};