import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, Calendar, Clock } from 'lucide-react';

// URL base da sua API
const API_BASE_URL = 'http://localhost:8080/api'; 

const GroupInfoScreen = ({ group, onBack }) => {
  const [activeTab, setActiveTab] = useState('classification');
  // 🔑 1. NOVOS ESTADOS PARA DADOS REAIS
  const [members, setMembers] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // FIX: Retorno imediato se o grupo não estiver definido
  if (!group) {
    return <div className="flex-1 ml-80 p-8 text-center text-gray-500">Selecione um grupo para visualizar os detalhes.</div>;
  }

  // 🔑 2. FUNÇÃO PARA BUSCAR OS DADOS NA API
  useEffect(() => {
    // A validação agora é redundante, mas mantida para clareza
    if (!group.id) return;

    const fetchGroupData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // A. Busca dos Membros (Classificação) - Retorna List<GroupMember>
        const membersResponse = await fetch(`${API_BASE_URL}/groups/${group.id}/members`);
        
        if (!membersResponse.ok) {
            const errorText = await membersResponse.text();
            throw new Error(`Falha ao carregar membros. Status: ${membersResponse.status}. Detalhe: ${errorText.substring(0, 100)}...`);
        }

        const membersData = await membersResponse.json();
        
        // Garante que a classificação é feita no frontend pelo número de checkins
        const sortedMembers = membersData.sort((a, b) => b.cachedCheckinCount - a.cachedCheckinCount);
        setMembers(sortedMembers);
        
        // B. Busca das Estatísticas - Retorna GroupStatsDto
        const statsResponse = await fetch(`${API_BASE_URL}/groups/${group.id}/stats`);
        
        if (!statsResponse.ok) {
            const errorText = await statsResponse.text();
            throw new Error(`Falha ao carregar estatísticas. Status: ${statsResponse.status}. Detalhe: ${errorText.substring(0, 100)}...`);
        }
        
        const statsData = await statsResponse.json();
        setStats(statsData);

      } catch (err) {
        setError(err.message); // Usa apenas a mensagem de erro para garantir que é uma string
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroupData();
    // Reexecuta sempre que o ID do grupo mudar
  }, [group.id]); 


  // --- LÓGICA DE CÁLCULO DE PROGRESSO ---
  const totalDays = group.durationDays || 30; // Agora seguro, pois 'group' é verificado
  const daysRemaining = group.daysRemaining || totalDays;
  const daysElapsed = totalDays - daysRemaining;
  
  let progress = (daysElapsed / totalDays) * 100;
  if (progress < 0) progress = 0;
  if (progress > 100) progress = 100;

  // Datas de inicio e fim (Baseado em startDate do Grupo)
  const startDate = group.startDate ? new Date(group.startDate) : new Date();
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + totalDays);

  const formatDate = (date) => {
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };
  
  // 🔑 3. CONTEÚDO DE CARREGAMENTO E ERRO
  if (isLoading) {
    return <div className="flex-1 ml-80 p-8 text-center text-gray-500">Carregando dados do grupo...</div>;
  }
  
  if (error) {
    return <div className="flex-1 ml-80 p-8 text-center text-red-500">Erro: {error}</div>;
  }
  
  // Garante que stats não é nulo antes de tentar acessar suas propriedades
  const displayStats = stats || {}; 
  
  // --- RENDERING (Mapeamento CORRETO para GroupMember) ---

  return (
    <div className="flex-1 ml-80 p-8 overflow-y-auto relative z-20">
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
          <div className="w-full bg-white rounded-full h-4 shadow-sm border border-gray-100">
            <div
              className="bg-[#2E67D3] h-4 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-right text-xs text-gray-400 mt-1">
            {daysElapsed} dias percorridos de {totalDays}
          </p>
        </div>
      </div>

      {/* tabs (permanecem iguais) */}
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
              {/* 🔑 MAPEAMENTO CORRETO */}
              {members.map((member, index) => (
                <div
                  // Acessa o ID do User dentro do objeto GroupMember
                  key={member.user.id} 
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-[#EDEDED] transition-all duration-300 hover:scale-[1.01]"
                >
                  <div className="w-8 text-center">
                    <span className="text-lg font-['Shanti'] font-semibold text-[#212121]">
                      {index + 1}º
                    </span>
                  </div>

                  <div className="w-12 h-12 rounded-full bg-[#2E67D3] flex items-center justify-center text-white font-['Shanti'] text-lg">
                    {member.user.name.charAt(0)}
                  </div>

                  <div className="flex-1">
                    <div className="font-['Shanti'] text-base text-[#212121] font-semibold">
                      {member.user.name}
                    </div>
                    <div className="font-['Shanti'] text-base text-gray-500">
                      {member.cachedActiveDays}{' '} 
                      {member.cachedActiveDays === 1 ? 'dia ativo' : 'dias ativos'}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-['Shanti'] text-xl font-semibold text-[#212121]">
                      {member.cachedCheckinCount}
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
            <div className="bg-white rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] group">
              <div className="flex items-center gap-4">
                <CheckCircle className="w-8 h-8 text-[#212121] flex-shrink-0 transition-colors duration-300 group-hover:text-[#2E67D3]" />
                <div className="flex-1">
                  <div className="text-2xl font-['Shanti'] font-semibold text-[#212121]">
                    {displayStats.totalCheckins || '0'} 
                  </div>
                  <div className="text-sm font-['Shanti'] text-gray-500">
                    Check-ins Totais
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] group">
              <div className="flex items-center gap-4">
                <Calendar className="w-8 h-8 text-[#212121] flex-shrink-0 transition-colors duration-300 group-hover:text-[#2E67D3]" />
                <div className="flex-1">
                  <div className="text-2xl font-['Shanti'] font-semibold text-[#212121]">
                    {displayStats.totalActiveDays || '0'} 
                  </div>
                  <div className="text-sm font-['Shanti'] text-gray-500">
                    Total de Dias Ativos
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] group">
              <div className="flex items-center gap-4">
                <Clock className="w-8 h-8 text-[#212121] flex-shrink-0 transition-colors duration-300 group-hover:text-[#2E67D3]" />
                <div className="flex-1">
                  <div className="text-2xl font-['Shanti'] font-semibold text-[#212121]">
                    {displayStats.avgCheckinsPerDay ? displayStats.avgCheckinsPerDay.toFixed(1) : '0.0'} 
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