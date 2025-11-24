import React from 'react';
import { Plus, MessageCircle } from 'lucide-react';

const FloatingButton = ({ onClick, onChatClick }) => {
  return (
    <div className="fixed bottom-8 right-8 flex flex-col gap-4 z-40">
      <button
        onClick={onChatClick}
        className="w-16 h-16 text-white rounded-full shadow-2xl transition-all hover:scale-110 flex items-center justify-center"
        style={{ background: '#2E67D3' }}
        title="Abrir chat do grupo"
      >
        <MessageCircle className="w-7 h-7" strokeWidth={2.5} />
      </button>
      
      <button
        onClick={onClick}
        className="w-16 h-16 text-white rounded-full shadow-2xl transition-all hover:scale-110 flex items-center justify-center"
        style={{ background: '#2E67D3' }}
        title="Adicionar check-in"
      >
        <Plus className="w-8 h-8" strokeWidth={2.5} />
      </button>
    </div>
  );
};

export default FloatingButton;