import React from 'react';
import { Calendar, Camera } from 'lucide-react';
import daviPhoto from '../imagens/Davi.jpeg';

// Assumindo que o App.js já passou a prop onImageChange (que lida com o upload)
const GroupHeader = ({ group, onShowInfo, onImageChange }) => {

  // 🔑 Desestruturação para obter os dados necessários
  const {
    name,
    image: imageUrl, // Renomeia 'image' para 'imageUrl' para clareza
    daysRemaining,
    myCheckins,
    leader,
    // (Os campos progressPercent, startDate, endDate são ignorados aqui, pois pertencem a GroupInfoScreen)
  } = group;

  // 🔑 Lógica que recebe o arquivo e chama o handler do App.jsx
  const handleImageChange = (e) => {
    // Para evitar que o clique na label acione o onShowInfo
    e.stopPropagation();
    const file = e.target.files[0];

    if (file && onImageChange) {
        // CHAMA O HANDLER EXTERNO: Inicia o upload e a atualização de estado no App.js
        onImageChange(file);
    }
  };

  // 🛑 REMOVIDO: Toda a lógica de Mocks e Cálculos (totalDays, daysElapsed, progress, startDate, endDate, formatDate)


  return (
    <div className="mb-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4 w-full max-w-3xl" style={{ fontFamily: "'Shantell Sans', cursive", color: '#212121' }}>
        {name}
      </h1>

      <div
        // 🔑 O clique aqui leva para a tela de informações do grupo
        onClick={onShowInfo}
        className="bg-white rounded-xl overflow-hidden w-full max-w-3xl transition-all duration-300 hover:scale-[1.02] cursor-pointer relative"
      >
        <div className="relative w-full h-48 group/image">
          {imageUrl ? (
            <img // Usa a prop group.image (que é a URL atual)
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover"
              // Adiciona fallback para imagens que falham no carregamento
              onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/600x192/2E67D3/FFFFFF?text=Imagem+Padrao" }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ background: '#2E67D3' }}>
              <span className="text-7xl">🏃</span>
            </div>
          )}

          {/* 🔑 CONTROLE DE UPLOAD: Botão Câmera e Input */}
          <label
            htmlFor="group-image-upload"
            // Parar a propagação é CRÍTICO: impede que o onShowInfo seja chamado
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-3 right-3 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-100 transition-colors opacity-0 group-hover/image:opacity-100 z-10"
          >
            <Camera className="w-5 h-5" style={{ color: '#2E67D3' }} />
            <input
              id="group-image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange} // Chama o handler de upload
              className="hidden"
            />
          </label>
        </div>

        <div className="p-6 flex items-center justify-around">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {leader.name.charAt(0)}
            </div>
            <div>
              <p className="text-base font-normal" style={{ color: '#212121' }}>{leader.checkins}</p>
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
              <p className="text-base font-normal" style={{ color: '#212121' }}>{myCheckins}</p>
              <p className="text-xs font-normal text-gray-500">Você</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-6 h-6" style={{ color: '#212121' }} />
            <p className="text-base font-normal" style={{ color: '#212121' }}>{daysRemaining} dias restantes</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupHeader;