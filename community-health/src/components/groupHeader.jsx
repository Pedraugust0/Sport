import React, { useState } from 'react'; // Mantemos useState para o estado do File
import { Calendar, Camera } from 'lucide-react';
import daviPhoto from '../imagens/Davi.jpeg';

// Assumindo que o App.js já passou a prop onImageChange (que lida com o upload)
const GroupHeader = ({ group, onShowInfo, onImageChange }) => {
  // 🔑 Removido useState(groupImage) e useEffect para evitar dessincronização

  // A URL ativa é sempre o valor da prop group.image (que o App.js atualiza após o upload)
  const imageUrl = group.image;

  // 🔑 ATUALIZADO: Captura o objeto File e chama o handler do App.js
  const handleImageChange = (e) => {
    // Para evitar que o clique na label acione o onShowInfo
    e.stopPropagation();
    const file = e.target.files[0];

    if (file) {
      // O App.js fará o upload real e a atualização do estado global.
      if (onImageChange) {
        // 🔑 CHAMA O HANDLER EXTERNO: Passa o objeto File real para o App.js
        onImageChange(file);
      }
    }
  };

  // --- Mocks e Cálculos (Mantidos) ---
  const totalDays = group.durationDays || 30; // duracao total do desafio
  const daysElapsed = totalDays - group.daysRemaining;
  const progress = (daysElapsed / totalDays) * 100;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - daysElapsed);
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + group.daysRemaining);

  const formatDate = (date) => {
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };
  // --- Fim Mocks ---

  return (
    <div className="mb-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4 w-full max-w-3xl" style={{ fontFamily: "'Shantell Sans', cursive", color: '#212121' }}>
        {group.name}
      </h1>

      <div
        onClick={onShowInfo}
        className="bg-white rounded-xl overflow-hidden w-full max-w-3xl transition-all duration-300 hover:scale-[1.02] cursor-pointer relative"
      >
        <div className="relative w-full h-48 group/image">
          {imageUrl ? (
            <img // 🔑 Usa a prop group.image (que já será a URL do backend ou o Base64 temporário)
              src={imageUrl}
              alt={group.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ background: '#2E67D3' }}>
              <span className="text-7xl">🏃</span>
            </div>
          )}

          <label
            htmlFor="group-image-upload"
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-3 right-3 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-100 transition-colors opacity-0 group-hover/image:opacity-100"
          >
            <Camera className="w-5 h-5" style={{ color: '#2E67D3' }} />
            <input
              id="group-image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange} // 🔑 Chama o novo handler que passa o File
              className="hidden"
            />
          </label>
        </div>

        <div className="p-6 flex items-center justify-around">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {group.leader.name.charAt(0)}
            </div>
            <div>
              <p className="text-base font-normal" style={{ color: '#212121' }}>{group.leader.checkins}</p>
              <p className="text-xs font-normal text-gray-500">Líder</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <img 
              src={daviPhoto} 
              alt="Você"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="text-base font-normal" style={{ color: '#212121' }}>{group.myCheckins}</p>
              <p className="text-xs font-normal text-gray-500">Você</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-6 h-6" style={{ color: '#212121' }} />
            <p className="text-base font-normal" style={{ color: '#212121' }}>{group.daysRemaining} dias restantes</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupHeader;