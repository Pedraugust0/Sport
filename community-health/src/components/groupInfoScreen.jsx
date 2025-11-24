import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, Calendar, Clock } from 'lucide-react';
// 🔑 Importar a função de busca de ranking
import { getGroupRanking } from '../services/groupService';

// Este componente é o que você vê na imagem (com Classificação/Estatísticas)
const GroupInfoScreen = ({ group, onBack }) => {
  const [activeTab, setActiveTab] = useState('classification');

  // 🆕 ESTADOS PARA DADOS REAIS
  const [rankingData, setRankingData] = useState([]);
  const [loadingRanking, setLoadingRanking] = useState(true);
  const [groupStats, setGroupStats] = useState({}); // Para dados de Estatísticas

  // -------------------------------------------------------------
  // LÓGICA DE CARREGAMENTO DE DADOS
  // -------------------------------------------------------------
  useEffect(() => {
    if (group?.id) {
        fetchRanking(group.id);
        // ⚠️ Aqui você também chamaria fetchGroupStats(group.id) quando o endpoint estiver pronto
    }
  }, [group?.id]);

  const fetchRanking = async (groupId) => {
    setLoadingRanking(true);
    try {
        const data = await getGroupRanking(groupId);

        // Mapeamento: O backend já retorna RankingDto
        const mappedData = data.map((item, index) => ({
            position: index + 1,
            userId: item.userId,
            userName: item.userName,
            activeDays: item.activeDays,
            checkins: item.totalCheckins,
            initial: item.userName ? item.userName.charAt(0) : '?',
        }));

        setRankingData(mappedData);

        // 🆕 CÁLCULO DE ESTATÍSTICAS (Baseado no ranking, enquanto não há endpoint dedicado)
        const totalCheckins = mappedData.reduce((sum, item) => sum + Number(item.checkins), 0);
        const maxActiveDays = mappedData.length > 0 ? Math.max(...mappedData.map(item => item.activeDays)) : 0;
        const totalMembers = mappedData.length;

        setGroupStats({
            totalCheckins,
            activeDays: maxActiveDays,
            avgCheckinsPerDay: totalMembers > 0 ? totalCheckins / totalMembers : 0,
        });

    } catch (error) {
        console.error("Falha ao carregar ranking do grupo:", error);
        setRankingData([]);
        setGroupStats({});
    } finally {
        setLoadingRanking(false);
    }
  };


  // calcular progresso (dias passados / total de dias) - Lógica mantida
  const totalDays = group.durationDays || 30; // Usa a duração real do grupo
  const daysElapsed = totalDays - group.daysRemaining;
  const progress = (daysElapsed / totalDays) * 100;

  // datas de inicio e fim - Lógica mantida
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - daysElapsed);
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + group.daysRemaining);

  const formatDate = (date) => {
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };


  // -------------------------------------------------------------
  // COMPONENTE DE CLASSIFICAÇÃO (Lista de Membros Ativos)
  // -------------------------------------------------------------
  const ClassificationList = () => {
    if (loadingRanking) {
        return <div className="text-center py-8 text-[#2E67D3] font-semibold">Carregando classificação...</div>;
    }

    if (rankingData.length === 0) {
        return <div className="text-center py-8 text-gray-500">Nenhum check-in registrado neste grupo ainda.</div>;
    }

    // 🔑 O mapeamento agora usa rankingData (dados reais e filtrados)
    return (
        <div className="bg-white rounded-2xl p-6">
            <div className="space-y-4">
              {rankingData.map((member, index) => (
                <div
                  key={member.userId} // 🔑 Usa o ID real do usuário
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-[#EDEDED] transition-all duration-300 hover:scale-[1.01]"
                >
                  {/* posição */}
                  <div className="w-8 text-center">
                    <span className="text-lg font-['Shanti'] font-semibold text-[#212121]">
                      {member.position}º
                    </span>
                  </div>

                  {/* avatar */}
                  <div className="w-12 h-12 rounded-full bg-[#2E67D3] flex items-center justify-center text-white font-['Shanti'] text-lg">
                    {member.initial}
                  </div>

                  {/* nome */}
                  <div className="flex-1">
                    <div className="font-['Shanti'] text-base text-[#212121] font-semibold">
                      {member.userName}
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
    );
  };

  // -------------------------------------------------------------
  // COMPONENTE DE ESTATÍSTICAS
  // -------------------------------------------------------------
  const StatisticsContent = () => {
      if (loadingRanking) {
          return <div className="text-center py-8 text-[#2E67D3] font-semibold">Calculando estatísticas...</div>;
      }
      return (
          <div className="grid gap-4">
            {/* card de check-ins totais */}
            <div className="bg-white rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] group">
              <div className="flex items-center gap-4">
                <CheckCircle className="w-8 h-8 text-[#212121] flex-shrink-0 transition-colors duration-300 group-hover:text-[#2E67D3]" />
                <div className="flex-1">
                  <div className="text-2xl font-['Shanti'] font-semibold text-[#212121]">
                    {groupStats.totalCheckins}
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
                    {groupStats.activeDays}
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
                    {groupStats.avgCheckinsPerDay?.toFixed(1) || '0.0'}
                  </div>
                  <div className="text-sm font-['Shanti'] text-gray-500">
                    Média de Check-ins por Pessoa Ativa
                  </div>
                </div>
              </div>
            </div>
          </div>
      );
  };

  // -------------------------------------------------------------

  return (
    <div className="flex-1 ml-80 p-8 overflow-y-auto relative z-20" style={{ background: '#EDEDED' }}>
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
        {activeTab === 'classification' && <ClassificationList />}
        {activeTab === 'statistics' && <StatisticsContent />}
      </div>
    </div>
  );
};

export default GroupInfoScreen;