import React, { useState } from 'react';
import { Clock } from 'lucide-react';

const CheckinItem = ({ checkin, onClick }) => {
  return (
    <div 
      onClick={() => onClick(checkin)}
      className="bg-white rounded-xl p-5 transition-all duration-300 hover:scale-[1.02] w-full max-w-3xl mx-auto cursor-pointer"
    >
      <div className="flex items-center gap-4">
        {/* avatar com foto ou inicial */}
        {checkin.photo ? (
          <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
            <img
              src={checkin.photo}
              alt={checkin.user.name}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0" style={{ background: '#2E67D3' }}>
            {checkin.user.name.charAt(0)}
          </div>
        )}

        {/* conteudo */}
        <div className="flex-1 min-w-0">
          {/* titulo do check-in */}
          <p className="font-bold text-lg mb-1" style={{ color: '#212121' }}>{checkin.activity}</p>
          
          {/* nome do usuario com avatar pequeno */}
          <div className="flex items-center gap-1.5">
            {checkin.userPhoto ? (
              <img 
                src={checkin.userPhoto} 
                alt={checkin.user.name}
                className="w-4 h-4 rounded-full object-cover"
              />
            ) : (
              <div className="w-4 h-4 rounded-full flex items-center justify-center text-white text-xs font-semibold" style={{ background: '#2E67D3' }}>
                {checkin.user.name.charAt(0)}
              </div>
            )}
            <p className="text-sm text-gray-600">{checkin.user.name}</p>
          </div>
        </div>

        {/* horario centralizado verticalmente */}
        <span className="text-sm text-gray-400">{checkin.time}</span>
      </div>
    </div>
  );
};

const ActivityFeed = ({ activities, onCheckinClick }) => {
  // agrupar atividades por data
  const groupedActivities = activities.reduce((acc, activity) => {
    const date = activity.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(activity);
    return acc;
  }, {});

  return (
    <div className="bg-transparent flex flex-col items-center">
      <div className="space-y-6 w-full">
        {Object.entries(groupedActivities).map(([date, items]) => (
          <div key={date} className="w-full flex flex-col items-center">
            {/* data centralizada */}
            <div className="w-full max-w-2xl flex items-center gap-3 mb-3">
              <div className="flex-1 h-px" style={{ background: '#EDEDED' }}></div>
              <h3 className="text-sm font-semibold text-gray-500 px-3">{date}</h3>
              <div className="flex-1 h-px" style={{ background: '#EDEDED' }}></div>
            </div>
            
            <div className="space-y-2 w-full">
              {items.map((activity, index) => (
                <CheckinItem key={index} checkin={activity} onClick={onCheckinClick} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;
