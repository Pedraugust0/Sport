import React from 'react';
import { X, CheckCircle, Users, Trophy } from 'lucide-react';

const Notification = ({ type = 'checkin', message, user, time, onClose }) => {
  const icons = {
    checkin: CheckCircle,
    member: Users,
    achievement: Trophy,
  };

  const colors = {
    checkin: 'bg-blue-500',
    member: 'bg-green-500',
    achievement: 'bg-yellow-500',
  };

  const Icon = icons[type];
  const colorClass = colors[type];

  return (
    <div className="fixed top-6 right-6 z-50 animate-slide-in">
      <div className="bg-white rounded-2xl shadow-2xl p-4 max-w-sm w-80 border border-gray-100">
        <div className="flex items-start gap-3">
          {/* Ícone */}
          <div className={`${colorClass} rounded-full p-2 flex-shrink-0`}>
            <Icon className="w-5 h-5 text-white" />
          </div>

          {/* Conteúdo */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 mb-1">{user}</p>
            <p className="text-sm text-gray-600 line-clamp-2">{message}</p>
            <p className="text-xs text-gray-400 mt-1">{time}</p>
          </div>

          {/* Botão fechar */}
          <button
            onClick={onClose}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notification;
