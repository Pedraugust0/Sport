import React from 'react';
import GroupCard from './GroupCard';
import { Plus, Award, Target } from 'lucide-react';

const Dashboard = ({ currentUser, onCreateGroupClick }) => {
  // Em uma implementação real, estes dados viriam de uma API (ex: /api/groups)
  // baseados no ID do currentUser
  const mockGroups = [
    {
      id: 1,
      name: 'Operação Foco Total',
      isPublic: false,
      members: 12,
      duration: '30 dias',
      daysRemaining: 18,
      progress: 75,
      yourScore: 850,
      streak: 12,
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
    },
    {
      id: 2,
      name: 'Corrida Matinal SP',
      isPublic: true,
      members: 28,
      duration: '60 dias',
      daysRemaining: 45,
      progress: 62,
      yourScore: 1240,
      streak: 8,
      color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
    },
    {
      id: 3,
      name: 'Academia Hardcore',
      isPublic: false,
      members: 8,
      duration: '90 dias',
      daysRemaining: 67,
      progress: 45,
      yourScore: 620,
      streak: 5,
      color: 'bg-gradient-to-r from-orange-500 to-red-500',
    },
    {
      id: 4,
      name: 'Yoga e Meditação',
      isPublic: true,
      members: 35,
      duration: '30 dias',
      daysRemaining: 22,
      progress: 88,
      yourScore: 950,
      streak: 15,
      color: 'bg-gradient-to-r from-green-500 to-emerald-500',
    },
    {
      id: 5,
      name: 'Ciclismo Urbano',
      isPublic: true,
      members: 19,
      duration: '45 dias',
      daysRemaining: 30,
      progress: 55,
      yourScore: 710,
      streak: 0,
      color: 'bg-gradient-to-r from-indigo-500 to-purple-500',
    },
  ];

  const stats = [
    {
      icon: Target,
      label: 'Desafios Ativos',
      value: '5',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: Award,
      label: 'Pontuação Total',
      value: '4,370',
      color: 'bg-emerald-100 text-emerald-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8 px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            {/* Saudação personalizada usando os dados do UserResponseDTO */}
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Olá, <span style={{ color: '#2E67D3' }}>{currentUser?.name || 'Atleta'}</span>!
            </h1>
            <p className="text-gray-600">Acompanhe seu progresso e mantenha a consistência!</p>
          </div>
          
          {/* Avatar do usuário no Dashboard (opcional, já que pode ter no menu lateral) */}
          {currentUser?.photoUrl && (
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md">
              <img src={currentUser.photoUrl} alt="Perfil" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}

          <button 
            onClick={onCreateGroupClick}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl shadow-md p-6 border border-emerald-400 transition-all flex items-center justify-center gap-3 font-semibold"
          >
            <Plus className="w-6 h-6" />
            <span>Criar Novo Desafio</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {mockGroups.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;