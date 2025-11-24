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
// 🔑 Importe as funções de API (INCLUINDO uploadImage e updateGroupImageUrl)
import { createGroup, getAllGroups, createCheckin, getCheckinsByGroupId, createComment, uploadImage, updateGroupImageUrl, uploadCheckinImage } from './services/groupService'; // ⬅️ Adicionei uploadCheckinImage

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
  const [selectedCheckin, setSelectedCheckin] = useState(null); // Agora armazenará o ID da API
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);

  // -------------------------------------------------------------
  // 🆕 FUNÇÃO AUXILIAR: Mapeia dados da API (Checkin Java) para a UI (ActivityFeed React)
  // -------------------------------------------------------------
  const mapApiCheckinsToUI = (apiCheckins) => {
    // Garante que os check-ins mais recentes apareçam primeiro
    return apiCheckins.map(apiCheckin => ({
        // 🔑 Adiciona o ID real do backend para ser usado no modal de detalhes/comentários
        apiId: apiCheckin.id,
        date: new Date(apiCheckin.createdAt).toLocaleDateString(),
        user: { name: apiCheckin.user ? apiCheckin.user.name : 'Davi de Souza' },
        userPhoto: daviPhoto,
        activity: apiCheckin.tituloAtividade,
        description: apiCheckin.descricao || '',
        time: new Date(apiCheckin.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        // 🔑 CORREÇÃO: Mapeia o photoUrl do backend para o campo 'photo' da UI
        photo: apiCheckin.photoUrl || null,
        metrics: {
            distance: apiCheckin.metricas.distanciaKm > 0 ? `${apiCheckin.metricas.distanciaKm} km` : null,
            duration: apiCheckin.metricas.duracaoMin > 0 ? `${apiCheckin.metricas.duracaoMin} min` : null,
            steps: apiCheckin.metricas.passos > 0 ? `${apiCheckin.metricas.passos} passos` : null,
        },
    })).sort((a, b) => new Date(b.time) - new Date(a.time));
  };

  // 🆕 FUNÇÃO AUXILIAR: Carrega e define o estado das atividades
  const loadCheckins = async (groupId) => {
      const fetchedCheckins = await getCheckinsByGroupId(groupId);
      const mappedActivities = mapApiCheckinsToUI(fetchedCheckins);
      setActivities(mappedActivities);
  }
  // -------------------------------------------------------------

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

          // 🚀 CHAMA A BUSCA DE CHECK-INS APÓS CARREGAR O PRIMEIRO GRUPO
          await loadCheckins(firstGroup.id);
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

  // Lógica de criação de Check-in (Modificada para usar a API)
  // 🔑 RECEBE AGORA O OBJETO FILE do modal (assumindo que ele o passa)
  const handleNewCheckin = async (data, fileObject) => {
    if (!currentGroup) {
        alert("Selecione um grupo para fazer o check-in.");
        return;
    }

    const currentGroupId = currentGroup.id;
    let photoUrl = null;

    // 1. UPLOAD LOGIC: UPLOAD MULTIPART E OBTENÇÃO DA URL
    if (fileObject) {
        try {
            photoUrl = await uploadCheckinImage(fileObject); // Chama a API de upload
        } catch (uploadError) {
            alert(`Falha ao carregar imagem: ${uploadError.message}. O check-in não será criado.`);
            return; // Interrompe a criação
        }
    }

    // 2. FINAL PAYLOAD: Adiciona a URL ao JSON
    const finalCheckinData = {
        ...data,
        photoUrl: photoUrl // 🔑 Inclui a URL salva no backend no payload
    };

    try {
        // 3. CRIA O CHECK-IN
        const newCheckinFromApi = await createCheckin(finalCheckinData, currentGroupId);

        // 4. Mapeamento e Atualização da UI
        // Recria o objeto UI do Check-in e o insere na lista
        const newCheckinForUI = mapApiCheckinsToUI([newCheckinFromApi])[0];

        setActivities(prevActivities => [newCheckinForUI, ...prevActivities]);
        setIsModalOpen(false);

    } catch (error) {
        console.error("Erro ao salvar Check-in via API:", error);
        alert(`Falha ao criar Check-in. Detalhe: ${error.message}`);
    }
  };

  // 🔑 ATUALIZADO: Define o Checkin selecionado (incluindo apiId)
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

    // 🚀 CHAMA A BUSCA DE CHECK-INS AO TROCAR DE GRUPO
    loadCheckins(group.id);
  };

  // 🖼️ LÓGICA DE UPLOAD/ATUALIZAÇÃO DE IMAGEM DO GRUPO (HEADER)
  const handleGroupImageChange = async (fileObject) => { // Recebe o objeto File
    if (!currentGroup || !fileObject) return;

    // ⚠️ Feedback visual temporário é tratado dentro do GroupHeader.jsx

    try {
        // 1. CHAMA O UPLOAD MULTIPART: Envia o arquivo real para o servidor
        const uploadedUrl = await uploadImage(fileObject);

        // 2. ATUALIZA O BANCO DE DADOS: Envia a URL salva de volta ao GroupController (PUT)
        const updatedGroup = await updateGroupImageUrl(currentGroup.id, uploadedUrl);

        // 3. ATUALIZA ESTADOS LOCAIS (Renderiza a nova imagem)
        const updatedImage = updatedGroup.imageUrl || uploadedUrl; // Usa o valor retornado

        setCurrentGroupData({ ...currentGroupData, image: updatedImage });

        // Atualiza a lista lateral de grupos
        setGroups(groups.map(g =>
            g.id === currentGroup.id ? { ...g, imageUrl: updatedImage } : g
        ));

        setCurrentGroup({ ...currentGroup, imageUrl: updatedImage });

    } catch (error) {
        console.error("Falha ao atualizar foto do grupo:", error);
        alert("Não foi possível atualizar a imagem. Tente novamente.");
    }
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
       // Imagem é tratada pelo modal e incluída no payload se o upload funcionar
       imageUrl: formData.imageUrl || null,
     };

     try {
         // 🔑 CORREÇÃO: Chame a API e defina a variável primeiro
         const newGroupFromApi = await createGroup(groupDataToSend, ownerId);

         // 🛑 Checagem de objeto válido agora é segura
         if (!newGroupFromApi || !newGroupFromApi.id) {
             console.error("API retornou objeto inválido ou sem ID.");
             // Lançamos um erro para cair no bloco catch e dar feedback
             throw new Error("Erro na API: Objeto de grupo retornado inválido. O servidor pode ter falhado.");
         }

         // Adiciona o novo grupo retornado pela API à lista
         setGroups(prevGroups => [...prevGroups, newGroupFromApi]);

         // Mapeia o objeto API para o formato detalhado do seu componente
         const newGroupData = {
           id: newGroupFromApi.id,
           name: newGroupFromApi.name,
           // 🔑 Usa a URL salva (ou null)
           image: newGroupFromApi.imageUrl || null,
           daysRemaining: newGroupFromApi.durationDays,
           myCheckins: 0,
           // 🔑 Mapeamento seguro do nome do Owner
           leader: { name: newGroupFromApi.owner?.name || 'salada de fruta', checkins: 0 },
           description: newGroupFromApi.description,
           isPrivate: newGroupFromApi.isPrivate,
         };

         // Atualiza o estado da aplicação para o novo grupo
         setCurrentGroup(newGroupFromApi);
         setCurrentGroupData(newGroupData);

         // Limpa e recarrega as atividades (que será uma lista vazia para o novo grupo)
         setActivities([]);

         setIsCreateGroupModalOpen(false); // Fecha o modal
     } catch (error) {
         console.error("Falha ao criar grupo:", error);
         // Exibe o erro no console e no alert
         alert(`Falha ao criar grupo. Detalhe: ${error.message}`);
     }
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
            onImageChange={handleGroupImageChange} // 🔑 LIGA A FUNÇÃO DE ORQUESTRAÇÃO
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
        onClose={() => setIsModalOpen(false)} // ✅ CORRIGIDO
        onSubmit={handleNewCheckin}
      />

      {/* Modal de Detalhes do Check-in */}
      <CheckinDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)} // ✅ CORRIGIDO
          checkin={selectedCheckin}
          onCreateComment={createComment}
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