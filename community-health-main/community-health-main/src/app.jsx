import React, { useState, useEffect } from "react";
import Sidebar from "./components/sidebar";
import GroupHeader from "./components/groupHeader";
import ActivityFeed from "./components/activityFeed";
import FloatingButton from "./components/floatingButton";
import CheckinModal from "./components/checkinModal";
import CheckinDetailModal from "./components/checkinDetailModal";
import GroupInfoScreen from "./components/groupInfoScreen";
import CreateGroupModal from "./components/createGroupModal";
import ChatScreen from "./components/chatScreen";
import Login from "./components/login";

// Serviços
import { createGroup, getGroups } from "./services/groupsService";

// Imagens Mock (fallback)
import paisagemPhoto from "./imagens/Paissagem.jpg";

function App() {
  // --- GESTÃO DE USUÁRIO ---
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setCurrentUser(null);
  };

  // --- ESTADOS ---
  const mockGroups = [
    { id: 'mock1', name: "Exemplo Local", active: true, image: paisagemPhoto, duration: 30 },
  ];

  const [groups, setGroups] = useState(mockGroups);
  
  // Estado do grupo selecionado e seus dados detalhados
  const [currentGroup, setCurrentGroup] = useState(mockGroups[0]);
  const [currentGroupData, setCurrentGroupData] = useState({
    id: 'mock1',
    name: "Exemplo Local",
    image: paisagemPhoto,
    totalDuration: 30,
    daysRemaining: 30,
    myCheckins: 0,
    leader: { name: "Sistema", checkins: 0 },
  });

  const [activities, setActivities] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCheckin, setSelectedCheckin] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);

  // 🆕 CARREGAR GRUPOS DO BACKEND AO INICIAR
  useEffect(() => {
    if (currentUser) {
      loadGroupsFromApi();
    }
  }, [currentUser]);

  const loadGroupsFromApi = async () => {
    try {
      const apiGroups = await getGroups();
      
      if (apiGroups && apiGroups.length > 0) {
        // Mapeia para garantir que os campos batam com o front
        const formattedGroups = apiGroups.map(g => ({
          id: g.id,
          name: g.name,
          // Backend manda "imageUrl", Frontend usa "image"
          image: g.imageUrl || null, 
          // Backend manda "durationDays", Frontend usa "duration" ou "totalDuration"
          totalDuration: g.durationDays || 30,
          daysRemaining: g.daysRemaining || 30,
          // Se não tiver leader definido ainda
          leader: g.owner ? { name: g.owner.name, checkins: 0 } : { name: "Líder", checkins: 0 }
        }));

        setGroups(formattedGroups);
        // Seleciona o primeiro grupo da lista real
        handleGroupChange(formattedGroups[0]);
      }
    } catch (error) {
      console.error("Erro ao carregar grupos:", error);
    }
  };

  // --- FUNÇÕES ---

  const handleNewCheckin = (data) => {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newCheckin = {
      id: Date.now(),
      date: "Hoje",
      user: { 
        name: currentUser.name,
        photoUrl: currentUser.photoUrl 
      },
      activity: data.title,
      description: data.description || "",
      time: currentTime,
      photo: data.photo ? URL.createObjectURL(data.photo) : null,
      metrics: data,
    };
    setActivities([newCheckin, ...activities]);
  };

  const handleGroupChange = (group) => {
    if (!group) return;
    setCurrentGroup(group);

    // Atualiza os dados detalhados do grupo atual
    setCurrentGroupData({
      id: group.id,
      name: group.name,
      image: group.image, 
      totalDuration: group.totalDuration || 30,
      daysRemaining: group.daysRemaining || 30, 
      myCheckins: 0,
      leader: group.leader || { name: currentUser?.name || "Alguém", checkins: 0 },
    });

    setActivities([]);
    setShowGroupInfo(false);
    setShowChat(false);
  };

  // 🆕 CRIAÇÃO DE GRUPO CONECTADA AO BACKEND
  const handleCreateGroup = async (data) => {
    try {
      // Prepara o payload adicionando o ID do dono
      const payload = {
        ...data,
        ownerId: currentUser.id // Necessário para o backend
      };

      // 1. Chama o serviço para salvar no banco
      const savedGroup = await createGroup(payload);

      // 2. Formata o objeto retornado do Java para o formato do React
      const newGroupFormatted = {
        id: savedGroup.id,
        name: savedGroup.name,
        image: savedGroup.imageUrl,
        totalDuration: savedGroup.durationDays,
        daysRemaining: savedGroup.durationDays, // Acabou de criar
        leader: { name: currentUser.name, checkins: 0 }
      };

      // 3. Atualiza a lista localmente
      const updatedGroups = [...groups, newGroupFormatted];
      setGroups(updatedGroups);
      
      // 4. Muda para o novo grupo
      handleGroupChange(newGroupFormatted);

      alert("Grupo criado com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Erro ao criar grupo: " + error.message);
    }
  };

  // --- RENDERIZAÇÃO ---

  if (!currentUser) {
    return (
      <div className="grid grid-cols-1 h-screen bg-blue-400">
        <div className="flex items-center justify-center h-auto">
          <Login onLogin={handleLogin} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#EDEDED" }}>
      <Sidebar
        currentUser={currentUser}
        groups={groups}
        currentGroup={currentGroup}
        onGroupChange={handleGroupChange}
        onCreateGroup={() => setIsCreateGroupModalOpen(true)}
        onLogout={handleLogout}
      />

      {showGroupInfo ? (
        <GroupInfoScreen 
          group={currentGroupData} 
          onBack={() => setShowGroupInfo(false)} 
        />
      ) : showChat ? (
        <ChatScreen 
          currentUser={currentUser}
          group={currentGroupData} 
          onBack={() => setShowChat(false)} 
        />
      ) : (
        <main className="flex-1 ml-80 p-8 overflow-y-auto">
          <GroupHeader
            currentUser={currentUser}
            group={currentGroupData}
            onShowInfo={() => setShowGroupInfo(true)}
            onImageChange={(img) =>
              setCurrentGroupData({ ...currentGroupData, image: img })
            }
          />

          <ActivityFeed 
            activities={activities} 
            onCheckinClick={(checkin) => {
              setSelectedCheckin(checkin);
              setIsDetailModalOpen(true);
            }} 
          />
        </main>
      )}

      {!showGroupInfo && !showChat && (
        <FloatingButton
          onClick={() => setIsModalOpen(true)}
          onChatClick={() => setShowChat(true)}
        />
      )}

      <CheckinModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleNewCheckin} 
      />

      <CheckinDetailModal
        currentUser={currentUser}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        checkin={selectedCheckin}
      />

      <CreateGroupModal
        isOpen={isCreateGroupModalOpen}
        onClose={() => setIsCreateGroupModalOpen(false)}
        onSubmit={handleCreateGroup}
      />
    </div>
  );
}

export default App;