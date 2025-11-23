import React, { useState } from 'react';
import { Calendar, Camera } from 'lucide-react';
import daviPhoto from '../imagens/Davi.jpeg';

const GroupHeader = ({ group, onShowInfo, onImageChange }) => {
  const [groupImage, setGroupImage] = useState(group.image);

  React.useEffect(() => {
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

  return (
    <div className="mb-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4 w-full max-w-3xl" style={{ fontFamily: "'Shantell Sans', cursive", color: '#212121' }}>
        {group.name}
      </h1>

      <div 
        onClick={onShowInfo}
        className="bg-white rounded-xl overflow-hidden w-full max-w-3xl transition-all duration-300 hover:scale-[1.02] cursor-pointer relative"
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
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {group.leader.name.charAt(0)}
            </div>
            <div>
              <p className="text-base font-normal" style={{ color: '#212121' }}>{group.leader.checkins}</p>
              <p className="text-xs font-normal text-gray-500">Líder</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <img 
              src={daviPhoto} 
              alt="Você"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="text-base font-normal" style={{ color: '#212121' }}>{group.myCheckins}</p>
              <p className="text-xs font-normal text-gray-500">Você</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-6 h-6" style={{ color: '#212121' }} />
            <p className="text-base font-normal" style={{ color: '#212121' }}>{group.daysRemaining} dias restantes</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupHeader;