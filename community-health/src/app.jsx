import React, { useState } from 'react';
import Sidebar from './components/sidebar';
import GroupHeader from './components/groupHeader';
import ActivityFeed from './components/activityFeed';
import FloatingButton from './components/floatingButton';
import CheckinModal from './components/checkinModal';
import CheckinDetailModal from './components/checkinDetailModal';
import GroupInfoScreen from './components/groupInfoScreen';
import CreateGroupModal from './components/createGroupModal';
import ChatScreen from './components/chatScreen';
import daviPhoto from './imagens/Davi.jpeg';
import paisagemPhoto from './imagens/Paissagem.jpg';

function App() {
  const mockGroups = [
    { id: 1, name: 'Operação Foco Total', active: true, image: paisagemPhoto },
  ];

  const mockGroupData = {
    id: 1,
    name: 'Operação Foco Total',
    image: paisagemPhoto,
    daysRemaining: 18,
    myCheckins: 12,
    leader: {
      name: 'Carlos Silva',
      checkins: 25,
    },
  };

  const [currentGroup, setCurrentGroup] = useState(mockGroups[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activities, setActivities] = useState([]);
  const [selectedCheckin, setSelectedCheckin] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [groups, setGroups] = useState(mockGroups);
  const [currentGroupData, setCurrentGroupData] = useState(mockGroupData);
  const [showChat, setShowChat] = useState(false);

  const handleNewCheckin = (data) => {
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
    
    if (group.id === 1) {
      setCurrentGroupData(mockGroupData);
    } else {
      const groupData = {
        id: group.id,
        name: group.name,
        image: group.image,
        daysRemaining: group.duration || 30,
        myCheckins: 0,
        leader: {
          name: 'Davi de Souza',
          checkins: 0,
        },
        description: group.description || '',
        isPrivate: group.isPrivate || false,
      };
      setCurrentGroupData(groupData);
    }
    
    setActivities([]);
  };

  const handleCreateGroup = (groupData) => {
    const newGroup = {
      id: groups.length + 1,
      name: groupData.name,
      active: true,
      image: groupData.image || null,
      description: groupData.description,
      duration: groupData.duration,
      isPrivate: groupData.isPrivate,
    };
    
    setGroups([...groups, newGroup]);
    
    const newGroupData = {
      id: newGroup.id,
      name: newGroup.name,
      image: newGroup.image,
      daysRemaining: groupData.duration,
      myCheckins: 0,
      leader: {
        name: 'Davi de Souza',
        checkins: 0,
      },
      description: groupData.description,
      isPrivate: groupData.isPrivate,
    };
    
    setCurrentGroup(newGroup);
    setCurrentGroupData(newGroupData);
    setActivities([]);
  };

  const handleGroupImageChange = (newImage) => {
    setCurrentGroupData({ ...currentGroupData, image: newImage });
    setGroups(groups.map(g => 
      g.id === currentGroup.id ? { ...g, image: newImage } : g
    ));
    setCurrentGroup({ ...currentGroup, image: newImage });
  };

  const handleChatClick = () => {
    setShowChat(true);
  };

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
