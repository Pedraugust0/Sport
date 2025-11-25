import React, { useState, useEffect, useRef } from "react";
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
import Notification from "./components/notification"; // 🔑 Importar o componente Notification

// Serviços
import { createGroup, getGroups } from "./services/groupsService";
import { createCheckin, getCheckinsByGroup } from "./services/checkinsService"; 

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  // 🔑 ESTADO E LÓGICA DA NOTIFICAÇÃO
  const [notification, setNotification] = useState(null);

  // Função central para exibir a notificação
  const showNotification = (type, message, user, time = 'Agora') => {
    // Para garantir que a notificação desapareça após 4 segundos
    if (notificationTimeout.current) {
        clearTimeout(notificationTimeout.current);
    }
    
    setNotification({ type, message, user, time });

    notificationTimeout.current = setTimeout(() => {
        setNotification(null);
    }, 4000); 
  };
  const notificationTimeout = useRef(null);
  // FIM DA LÓGICA DA NOTIFICAÇÃO

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

  const [groups, setGroups] = useState([]);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [currentGroupData, setCurrentGroupData] = useState(null);
  const [activities, setActivities] = useState([]); 

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCheckin, setSelectedCheckin] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);

  // --- FUNÇÕES AUXILIARES (Definidas ANTES do useEffect) ---

  const loadCheckinsFromApi = async (groupId) => {
    try {
      const apiCheckins = await getCheckinsByGroup(groupId);
      
      const formattedCheckins = apiCheckins.map(c => ({
        id: c.id,
        date: new Date(c.createdAt).toLocaleDateString('pt-BR'), 
        time: new Date(c.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        activity: c.tituloAtividade,
        description: c.descricao,
        photo: c.photoUrl,
        metrics: {
            distance: c.metricas?.distanciaKm,
            duration: c.metricas?.duracaoMin,
            steps: c.metricas?.passos
        },
        user: c.user,
        userPhoto: c.user.photoUrl
      })).reverse(); 

      setActivities(formattedCheckins);
    } catch (error) {
      console.error("Erro ao carregar check-ins:", error);
      showNotification('error', 'Falha ao carregar atividades.', currentUser?.name);
    }
  };

  const handleGroupChange = (group) => {
    if (!group) return;
    setCurrentGroup(group);

    setCurrentGroupData({
      id: group.id,
      name: group.name,
      image: group.image, 
      totalDuration: group.totalDuration || 30,
      daysRemaining: group.daysRemaining || 30, 
      myCheckins: 0,
      leader: group.leader || { name: currentUser?.name || "Alguém", checkins: 0 },
    });

    setShowGroupInfo(false);
    setShowChat(false);
    
    loadCheckinsFromApi(group.id);
  };

  const loadGroupsFromApi = async (userId) => {
    try {
      const apiGroups = await getGroups(userId);
      
      if (apiGroups && apiGroups.length > 0) {
        const formattedGroups = apiGroups.map(g => ({
          id: g.id,
          name: g.name,
          image: g.imageUrl || null, 
          totalDuration: g.durationDays || 30,
          daysRemaining: g.daysRemaining || 30,
          leader: g.owner ? { name: g.owner.name, checkins: 0 } : { name: "Líder", checkins: 0 }
        }));

        setGroups(formattedGroups);
        
        if (!currentGroup || !formattedGroups.find(g => g.id === currentGroup.id)) {
            handleGroupChange(formattedGroups[0]);
        }
      } else {
        setGroups([]);
        setCurrentGroup(null);
        setCurrentGroupData(null);
      }
    } catch (error) {
      console.error("Erro ao carregar grupos:", error);
      showNotification('error', 'Falha ao carregar seus grupos.', currentUser?.name);
    }
  };

  // --- USE EFFECTS ---

  useEffect(() => {
    if (currentUser) {
      loadGroupsFromApi(currentUser.id);
    }
  }, [currentUser]);

  // --- HANDLERS ---

  const handleNewCheckin = async (data) => {
    try {
      if (!currentGroup) return;
      await createCheckin(data, currentGroup.id, currentUser.id);
      
      // Notificação de sucesso
      showNotification('checkin', `Novo check-in publicado: ${data.title}`, currentUser.name); 
      
      await loadCheckinsFromApi(currentGroup.id);
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      showNotification('error', `Erro ao criar check-in: ${error.message}`, currentUser.name); 
    }
  };

  const handleCreateGroup = async (data) => {
    try {
      const payload = { ...data, ownerId: currentUser.id };
      await createGroup(payload); 
      
      showNotification('member', `O grupo "${data.name}" foi criado!`, currentUser.name);
      
      loadGroupsFromApi(currentUser.id);
      setIsCreateGroupModalOpen(false);
    } catch (error) {
      console.error(error);
      showNotification('error', `Erro ao criar grupo: ${error.message}`, currentUser.name); 
    }
  };

  // --- RENDER ---

  if (!currentUser) {
    return (
      <div className="grid grid-cols-1 h-screen bg-blue-400">
        <div className="flex items-center justify-center h-auto">
          <Login onLogin={handleLogin} showNotification={showNotification} /> {/* 🔑 Passando Notificação */}
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

      {/* 🔑 Renderiza a Notificação se houver estado */}
      {notification && (
        <Notification
            type={notification.type}
            message={notification.message}
            user={notification.user}
            time={notification.time}
            onClose={() => clearTimeout(notificationTimeout.current) & setNotification(null)}
        />
      )}
      {/* FIM DA NOTIFICAÇÃO */}

      {showGroupInfo && currentGroupData ? (
        <GroupInfoScreen 
          group={currentGroupData} 
          onBack={() => setShowGroupInfo(false)} 
        />
      ) : showChat && currentGroupData ? (
        <ChatScreen 
          currentUser={currentUser}
          group={currentGroupData} 
          onBack={() => setShowChat(false)} 
        />
      ) : (
        <main className="flex-1 ml-80 p-8 overflow-y-auto">
          {currentGroupData ? (
            <>
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
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <p className="text-xl">Você ainda não tem grupos.</p>
              <p>Crie um novo grupo para começar!</p>
            </div>
          )}
        </main>
      )}

      {!showGroupInfo && !showChat && currentGroupData && (
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