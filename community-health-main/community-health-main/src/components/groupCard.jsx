import React from 'react';
import { Info } from 'lucide-react';

const GroupCard = ({ group, onInfoClick }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-100 transition-all duration-300 hover:scale-[1.02] cursor-pointer relative">
      <button
        onClick={onInfoClick}
        className="absolute top-4 right-4 p-2 bg-white hover:bg-[#EDEDED] rounded-full transition-colors z-10"
      >
        <Info className="w-5 h-5 text-[#2E67D3]" />
      </button>
      
      <div className="p-6">
        {/* Conteúdo do card permanece igual */}
      </div>
    </div>
  );
};

export default GroupCard;
