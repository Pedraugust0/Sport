import React, { useState } from 'react';
import { Home, Users, Plus, Settings, Camera } from 'lucide-react';
import daviPhoto from '../imagens/Davi.jpeg';

// 🔑 Recebe a prop currentUser
const Sidebar = ({ groups, currentGroup, onGroupChange, onCreateGroup, currentUser }) => {
  const menuItems = [
    { icon: Plus, label: 'Criar grupo', action: 'create' },
    { icon: Users, label: 'Juntar-se ao grupo', action: 'join' },
  ];

  const handleMenuClick = (action) => {
    if (action === 'create' && onCreateGroup) {
      onCreateGroup();
    }
  };

  const userName = currentUser?.name || 'Davi de Souza';
  const userLevel = currentUser?.level || 1;
  // 🔑 Usa photoUrl real do backend se estiver disponível
  const userPhoto = currentUser?.photoUrl || daviPhoto;

  return (
    <aside className="w-80 text-white h-screen fixed left-0 top-0 shadow-2xl flex flex-col z-10" style={{ background: 'linear-gradient(180deg, #2E67D3 0%, #1e4a9f 100%)' }}>
      {/* User Profile */}
      <div className="p-6 pb-5 border-b border-white border-opacity-10">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              // 🔑 EXIBIÇÃO: Usa a foto real ou o mock local
              src={userPhoto}
              alt={userName}
              className="w-14 h-14 rounded-full object-cover border-3 border-white shadow-lg"
            />
          </div>
          <div className="flex-1">
            <p className="font-bold text-base">{userName}</p>
            <div className="flex items-center gap-2 mt-1">
              {/* 🔑 EXIBIÇÃO: Usa o Level real do backend */}
              <span className="text-xs bg-white bg-opacity-20 px-2 py-0.5 rounded-full font-medium">Level {userLevel}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Groups List */}
      <div className="flex-1 overflow-y-auto py-4">
        <div className="px-4 mb-3">
          <p className="text-xs font-semibold uppercase tracking-wider opacity-60">Meus Grupos</p>
        </div>
        <div className="space-y-1 px-3">
          {groups.map((group) => (
            <button
              key={group.id}
              onClick={() => onGroupChange(group)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left hover:bg-white hover:bg-opacity-15 active:scale-98"
              // 🔑 Estilo ativo (mantido)
            >
              {/* Foto do grupo */}
              {group.image ? (
                <img
                  // 🔑 Usa a imageUrl real salva no DB
                  src={group.image}
                  alt={group.name}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                     style={{ background: 'rgba(255,255,255,0.25)' }}>
                  {group.name.charAt(0)}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium truncate block">{group.name}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 pt-4 px-3 border-t border-white border-opacity-10">
          <div className="px-4 mb-3">
            <p className="text-xs font-semibold uppercase tracking-wider opacity-60">Ações</p>
          </div>
          <div className="space-y-1">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleMenuClick(item.action)}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white hover:bg-opacity-15 transition-all text-sm font-medium"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="p-4 border-t border-white border-opacity-10">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white hover:bg-opacity-15 transition-all text-sm font-medium">
          <Settings className="w-5 h-5" />
          <span>Configurações</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;