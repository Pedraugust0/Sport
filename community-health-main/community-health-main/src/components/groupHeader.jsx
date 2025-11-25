import React, { useState, useEffect } from 'react';
import { Calendar, Camera } from 'lucide-react';

const GroupHeader = ({ group, currentUser, onShowInfo, onImageChange }) => {
  const [groupImage, setGroupImage] = useState(group.image);

  useEffect(() => {
    setGroupImage(group.image);
  }, [group.id, group.image]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setGroupImage(reader.result);
        if (onImageChange) {
          onImageChange(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Dados do usuário logado
  const userPhoto = currentUser?.photoUrl;
  const userName = currentUser?.name || 'Você';

  return (
    <div className="mb-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4 w-full max-w-3xl text-center md:text-left" style={{ fontFamily: "'Shantell Sans', cursive", color: '#212121' }}>
        {group.name}
      </h1>

      <div 
        onClick={onShowInfo}
        className="bg-white rounded-xl overflow-hidden w-full max-w-3xl transition-all duration-300 hover:scale-[1.02] cursor-pointer relative shadow-sm"
      >
        <div className="relative w-full h-48 group/image">
          {groupImage ? (
            <img 
              src={groupImage} 
              alt={group.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ background: '#2E67D3' }}>
              <span className="text-7xl">🏃</span>
            </div>
          )}
          
          <label 
            htmlFor="group-image-upload"
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-3 right-3 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-100 transition-colors opacity-0 group-hover/image:opacity-100"
          >
            <Camera className="w-5 h-5" style={{ color: '#2E67D3' }} />
            <input
              id="group-image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        <div className="p-6 flex items-center justify-around">
          
          {/* Líder (Mockado por enquanto) */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow">
              {group.leader?.name?.charAt(0) || 'L'}
            </div>
            <div>
              <p className="text-base font-bold" style={{ color: '#212121' }}>{group.leader?.checkins || 0}</p>
              <p className="text-xs font-normal text-gray-500">Líder</p>
            </div>
          </div>

          {/* Você (Usuário Logado) */}
          <div className="flex items-center gap-2">
             {userPhoto ? (
               <img 
               src={userPhoto} 
               alt={userName}
               className="w-10 h-10 rounded-full object-cover border border-gray-200"
             />
             ) : (
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold text-sm">
                    {userName.charAt(0)}
                </div>
             )}
            
            <div>
              <p className="text-base font-bold" style={{ color: '#212121' }}>{group.myCheckins || 0}</p>
              <p className="text-xs font-normal text-gray-500">Você</p>
            </div>
          </div>

          {/* Dias Restantes */}
          <div className="flex items-center gap-2">
            <Calendar className="w-6 h-6" style={{ color: '#212121' }} />
            <p className="text-sm md:text-base font-medium" style={{ color: '#212121' }}>
                {group.daysRemaining} dias restantes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupHeader;