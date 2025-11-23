import React, { useState, useEffect } from 'react';
import Sidebar from './components/sidebar';
import GroupHeader from './components/groupHeader';
import ActivityFeed from './components/activityFeed';
import FloatingButton from './components/floatingButton';
import CheckinModal from './components/checkinModal';
import CheckinDetailModal from './components/checkinDetailModal';
import GroupInfoScreen from './components/groupInfoScreen';
import CreateGroupModal from './components/createGroupModal';
import ChatScreen from './components/chatScreen';
// Importe as funções da API
import { createGroup, getAllGroups } from './services/groupService';

// Importações locais (imagens)
import daviPhoto from './imagens/Davi.jpeg';

function App() {

  // 1. ESTADOS INICIAIS (agora baseados na API)
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState([]); // Lista de grupos da API
  const [currentGroup, setCurrentGroup] = useState(null); // Grupo selecionado (objeto da API)
  const [currentGroupData, setCurrentGroupData] = useState(null); // Objeto detalhado para o header/info

  // Estados de UI
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activities, setActivities] = useState([]);
  const [selectedCheckin, setSelectedCheckin] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);

  // 2. LÓGICA DE CARREGAMENTO INICIAL (Substitui os Mocks)
  useEffect(() => {
    async function loadInitialGroups() {
      try {
        const fetchedGroups = await getAllGroups();
        setGroups(fetchedGroups);

        if (fetchedGroups.length > 0) {
          const firstGroup = fetchedGroups[0];
          setCurrentGroup(firstGroup);

          // Mapeia o objeto API para o formato detalhado do seu componente
          setCurrentGroupData({
            id: firstGroup.id,
            name: firstGroup.name,
            image: firstGroup.imageUrl || null,
            daysRemaining: firstGroup.daysRemaining || firstGroup.durationDays,
            myCheckins: 0,
            leader: { name: 'Líder', checkins: 0 },
            description: firstGroup.description,
            isPrivate: firstGroup.isPrivate,
          });
        }
      } catch (error) {
        console.error("Falha ao carregar grupos iniciais:", error);
      } finally {
        setLoading(false);
      }
    }
    loadInitialGroups();
  }, []);


  // --- FUNÇÕES ---

  const handleNewCheckin = (data) => {
    // ⚠️ Lógica de Check-in (mantida como mock, precisará de API)
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const currentTime = `${hours}:${minutes}`;

    let photoUrl = null;
    if (data.photo) {
      photoUrl = URL.createObjectURL(data.photo);
    }

    const metrics = {};
    if (data.distance) metrics.distance = `${data.distance} km`;
    if (data.duration) metrics.duration = `${data.duration} min`;
    if (data.steps) metrics.steps = `${data.steps} passos`;

    const newCheckin = {
      date: 'Hoje',
      user: { name: 'Davi de Souza' },
      userPhoto: daviPhoto,
      activity: data.title,
      description: data.description || '',
      time: currentTime,
      photo: photoUrl,
      metrics: Object.keys(metrics).length > 0 ? metrics : null,
    };

    setActivities([newCheckin, ...activities]);
  };

  const handleCheckinClick = (checkin) => {
    setSelectedCheckin(checkin);
    setIsDetailModalOpen(true);
  };

  const handleGroupChange = (group) => {
    setCurrentGroup(group);

    // Mapeamento de Group da API para GroupData para UI
    const groupData = {
        id: group.id,
        name: group.name,
        image: group.imageUrl || null,
        daysRemaining: group.daysRemaining || group.durationDays || 30,
        myCheckins: 0,
        leader: { name: 'Davi de Souza', checkins: 0 },
        description: group.description || '',
        isPrivate: group.isPrivate || false,
    };
    setCurrentGroupData(groupData);

    setActivities([]);
  };

  //Lógica de criação de Grupo
  const handleCreateGroup = async (formData) => {

     //Aqui é definido como 1 pois tem um arquivo em ./resources/data.sql que cria um usuário para teste e o id é 1
     const ownerId = 1;

     const groupDataToSend = {
       name: formData.name,
       description: formData.description || null,
       durationDays: Number(formData.duration),
       isPrivate: formData.isPrivate,
     };

     try {
         const newGroupFromApi = await createGroup(groupDataToSend, ownerId);

         // Adiciona o novo grupo retornado pela API à lista
         setGroups(prevGroups => [...prevGroups, newGroupFromApi]);

         // Mapeia o objeto API para o formato detalhado do seu componente
         const newGroupData = {
           id: newGroupFromApi.id,
           name: newGroupFromApi.name,
           image: newGroupFromApi.imageUrl || null,
           daysRemaining: newGroupFromApi.durationDays,
           myCheckins: 0,
           leader: { name: 'salada de fruta', checkins: 0 },
           description: newGroupFromApi.description,
           isPrivate: newGroupFromApi.isPrivate,
         };

         // Atualiza o estado da aplicação para o novo grupo
         setCurrentGroup(newGroupFromApi);
         setCurrentGroupData(newGroupData);
         setActivities([]);
         setIsCreateGroupModalOpen(false); // Fecha o modal
     } catch (error) {
         console.error("Falha ao criar grupo:", error);
         alert(`Falha ao criar grupo. Detalhe: ${error.message}`);
     }
  };

  const handleGroupImageChange = (newImage) => {
    // ⚠️ Lógica de Imagem (mantida como mock, precisará de API)
    setCurrentGroupData({ ...currentGroupData, image: newImage });
    setGroups(groups.map(g =>
      g.id === currentGroup.id ? { ...g, image: newImage } : g
    ));
    setCurrentGroup({ ...currentGroup, image: newImage });
  };

  const handleChatClick = () => {
    setShowChat(true);
  };

  // 4. RENDERIZAÇÃO CONDICIONAL DE CARREGAMENTO
  if (loading) {
    return (
        <div className="flex justify-center items-center min-h-screen" style={{ backgroundColor: '#EDEDED' }}>
            Carregando dados do servidor...
        </div>
    );
  }

  // Não renderiza a aplicação principal se não houver grupo atual selecionado
  if (!currentGroup) {
      return (
          <div className="flex min-h-screen" style={{ backgroundColor: '#EDEDED' }}>
              <Sidebar
                  groups={groups}
                  currentGroup={currentGroup}
                  onGroupChange={handleGroupChange}
                  onCreateGroup={() => setIsCreateGroupModalOpen(true)}
              />
              <main className="flex-1 ml-72 p-8">
                  <p>Nenhum grupo encontrado. Crie um novo grupo para começar!</p>
              </main>
               <CreateGroupModal
                  isOpen={isCreateGroupModalOpen}
                  onClose={() => setIsCreateGroupModalOpen(false)}
                  onSubmit={handleCreateGroup}
              />
          </div>
      );
  }

  // 5. RENDERIZAÇÃO PRINCIPAL
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#EDEDED' }}>
      <Sidebar
        groups={groups}
        currentGroup={currentGroup}
        onGroupChange={handleGroupChange}
        onCreateGroup={() => setIsCreateGroupModalOpen(true)}
      />

      {showGroupInfo ? (
        <GroupInfoScreen
          group={currentGroupData}
          onBack={() => setShowGroupInfo(false)}
        />
      ) : showChat ? (
        <ChatScreen
          group={currentGroupData}
          onBack={() => setShowChat(false)}
        />
      ) : (
        <main className="flex-1 ml-72 p-8 overflow-y-auto">
          <GroupHeader
            group={currentGroupData}
            onShowInfo={() => setShowGroupInfo(true)}
            onImageChange={handleGroupImageChange}
          />
          <ActivityFeed activities={activities} onCheckinClick={handleCheckinClick} />
        </main>
      )}

      {/* Botão Flutuante */}
      {!showGroupInfo && !showChat && (
        <FloatingButton
          onClick={() => setIsModalOpen(true)}
          onChatClick={handleChatClick}
        />
      )}

      {/* Modal de Check-in */}
      <CheckinModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleNewCheckin}
      />

      {/* Modal de Detalhes do Check-in */}
      <CheckinDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        checkin={selectedCheckin}
      />

      {/* Modal de Criar Grupo */}
      <CreateGroupModal
        isOpen={isCreateGroupModalOpen}
        onClose={() => setIsCreateGroupModalOpen(false)}
        onSubmit={handleCreateGroup}
      />
    </div>
  );
}

export default App;