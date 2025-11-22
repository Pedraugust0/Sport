import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, Calendar, Clock } from 'lucide-react';

const GroupInfoScreen = ({ group, onBack }) => {
  const [activeTab, setActiveTab] = useState('classification');

  // dados mockados de membros e suas pontuacoes
  const members = [
    { id: 1, name: 'Carlos Silva', checkins: 25, activeDays: 18, photo: null },
    { id: 2, name: 'Davi de Souza', checkins: 12, activeDays: 10, photo: null },
    { id: 3, name: 'Maria Santos', checkins: 18, activeDays: 15, photo: null },
    { id: 4, name: 'João Pedro', checkins: 8, activeDays: 7, photo: null },
  ].sort((a, b) => b.checkins - a.checkins);

  // estatisticas do grupo
  const stats = {
    totalCheckins: 63,
    activeDays: 18,
    avgCheckinsPerDay: 3.5,
  };

  // calcular progresso (dias passados / total de dias)
  const totalDays = 30; // duracao total do desafio
  const daysElapsed = totalDays - group.daysRemaining;
  const progress = (daysElapsed / totalDays) * 100;

  // datas de inicio e fim
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - daysElapsed);
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + group.daysRemaining);

  const formatDate = (date) => {
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  return (
    <div className="flex-1 ml-80 p-8 overflow-y-auto relative z-20">
      {/* header com botao de voltar */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="mb-4 w-8 h-8 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-3xl font-['Shantell_Sans'] font-semibold text-[#212121] mb-6">
          {group.name}
        </h1>

        {/* barra de progresso */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-[#212121] mb-2 font-['Shanti']">
            <div>
              <span className="font-semibold">Iniciado: </span>
              <span className="text-gray-500">{formatDate(startDate)}</span>
            </div>
            <div>
              <span className="font-semibold">Termina: </span>
              <span className="text-gray-500">{formatDate(endDate)}</span>
            </div>
          </div>
          <div className="w-full bg-white rounded-full h-4">
            <div
              className="bg-[#2E67D3] h-4 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* tabs */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setActiveTab('classification')}
          className={`px-6 py-3 rounded-full font-['Shanti'] text-base font-medium transition-all ${
            activeTab === 'classification'
              ? 'bg-[#2E67D3] text-white shadow-md'
              : 'bg-white text-[#212121] hover:bg-gray-100'
          }`}
        >
          Classificação
        </button>
        <button
          onClick={() => setActiveTab('statistics')}
          className={`px-6 py-3 rounded-full font-['Shanti'] text-base font-medium transition-all ${
            activeTab === 'statistics'
              ? 'bg-[#2E67D3] text-white shadow-md'
              : 'bg-white text-[#212121] hover:bg-gray-100'
          }`}
        >
          Estatísticas
        </button>
      </div>

      {/* conteudo das tabs */}
      <div>
        {activeTab === 'classification' && (
          <div className="bg-white rounded-2xl p-6">
            <div className="space-y-4">
              {members.map((member, index) => (
                <div
                  key={member.id}
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-[#EDEDED] transition-all duration-300 hover:scale-[1.01]"
                >
                  {/* posicao */}
                  <div className="w-8 text-center">
                    <span className="text-lg font-['Shanti'] font-semibold text-[#212121]">
                      {index + 1}º
                    </span>
                  </div>

                  {/* avatar */}
                  <div className="w-12 h-12 rounded-full bg-[#2E67D3] flex items-center justify-center text-white font-['Shanti'] text-lg">
                    {member.name.charAt(0)}
                  </div>

                  {/* nome */}
                  <div className="flex-1">
                    <div className="font-['Shanti'] text-base text-[#212121] font-semibold">
                      {member.name}
                    </div>
                    <div className="font-['Shanti'] text-base text-gray-500">
                      {member.activeDays} {member.activeDays === 1 ? 'dia ativo' : 'dias ativos'}
                    </div>
                  </div>

                  {/* check-ins */}
                  <div className="text-right">
                    <div className="font-['Shanti'] text-xl font-semibold text-[#212121]">
                      {member.checkins}
                    </div>
                    <div className="font-['Shanti'] text-sm text-gray-500">
                      check-ins
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'statistics' && (
          <div className="grid gap-4">
            {/* card de check-ins totais */}
            <div className="bg-white rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] group">
              <div className="flex items-center gap-4">
                <CheckCircle className="w-8 h-8 text-[#212121] flex-shrink-0 transition-colors duration-300 group-hover:text-[#2E67D3]" />
                <div className="flex-1">
                  <div className="text-2xl font-['Shanti'] font-semibold text-[#212121]">
                    {stats.totalCheckins}
                  </div>
                  <div className="text-sm font-['Shanti'] text-gray-500">
                    Check-ins Totais
                  </div>
                </div>
              </div>
            </div>

            {/* card de dias ativos */}
            <div className="bg-white rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] group">
              <div className="flex items-center gap-4">
                <Calendar className="w-8 h-8 text-[#212121] flex-shrink-0 transition-colors duration-300 group-hover:text-[#2E67D3]" />
                <div className="flex-1">
                  <div className="text-2xl font-['Shanti'] font-semibold text-[#212121]">
                    {stats.activeDays}
                  </div>
                  <div className="text-sm font-['Shanti'] text-gray-500">
                    Total de Dias Ativos
                  </div>
                </div>
              </div>
            </div>

            {/* card de media de check-ins */}
            <div className="bg-white rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] group">
              <div className="flex items-center gap-4">
                <Clock className="w-8 h-8 text-[#212121] flex-shrink-0 transition-colors duration-300 group-hover:text-[#2E67D3]" />
                <div className="flex-1">
                  <div className="text-2xl font-['Shanti'] font-semibold text-[#212121]">
                    {stats.avgCheckinsPerDay.toFixed(1)}
                  </div>
                  <div className="text-sm font-['Shanti'] text-gray-500">
                    Média de Check-ins por Dia
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupInfoScreen;
