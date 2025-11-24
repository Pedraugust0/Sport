import React from 'react';

const CheckinItem = ({ checkin, onClick }) => {
  const user = checkin.user || {};
  
  const userName = user.name || "Anônimo";
  const userAvatarUrl = user.photoUrl; 

  return (
    <div 
      onClick={() => onClick(checkin)}
      className="bg-white rounded-xl p-5 transition-all duration-300 hover:scale-[1.02] w-full max-w-3xl mx-auto cursor-pointer border border-gray-100 shadow-sm"
    >
      <div className="flex items-center gap-4">
        {}
        {checkin.photo ? (
          <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
            <img
              src={checkin.photo}
              alt="Atividade"
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          /* Fallback se não tiver foto da atividade: mostra a inicial do usuário ou ícone */
          <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 shadow-inner" style={{ background: '#2E67D3' }}>
            {userName.charAt(0).toUpperCase()}
          </div>
        )}

        {/* CONTEÚDO */}
        <div className="flex-1 min-w-0">
          {/* Nome da atividade ou descrição */}
          <p className="font-bold text-lg mb-1 text-gray-800 leading-tight">
            {checkin.activity || "Nova atividade"}
          </p>
          
          {/* INFO DO USUÁRIO (Avatar pequeno + Nome) */}
          <div className="flex items-center gap-2">
            {userAvatarUrl ? (
              <img 
                src={userAvatarUrl} 
                alt={userName}
                className="w-5 h-5 rounded-full object-cover border border-gray-200"
              />
            ) : (
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold" style={{ background: '#9CA3AF' }}>
                {userName.charAt(0).toUpperCase()}
              </div>
            )}
            <p className="text-sm text-gray-500 font-medium">{userName}</p>
          </div>
        </div>

        {/* HORÁRIO */}
        <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
            {checkin.time}
        </span>
      </div>
    </div>
  );
};

const ActivityFeed = ({ activities, onCheckinClick }) => {
  // Agrupar atividades por data
  // Supondo que 'activities' seja um array vindo do backend
  const groupedActivities = activities.reduce((acc, activity) => {
    // Se a data vier no formato ISO do Java (yyyy-MM-dd), pode precisar formatar aqui
    const date = activity.date || "Hoje"; 
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(activity);
    return acc;
  }, {});

  return (
    <div className="w-full flex flex-col items-center">
      <div className="space-y-6 w-full">
        {Object.entries(groupedActivities).length === 0 ? (
           <p className="text-center text-gray-400 mt-10">Nenhuma atividade recente.</p>
        ) : (
            Object.entries(groupedActivities).map(([date, items]) => (
            <div key={date} className="w-full flex flex-col items-center animate-fadeIn">
                {/* Divisor de Data */}
                <div className="w-full max-w-2xl flex items-center gap-3 mb-4 mt-2">
                <div className="flex-1 h-px bg-gray-200"></div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2">{date}</h3>
                <div className="flex-1 h-px bg-gray-200"></div>
                </div>
                
                {/* Lista de Check-ins */}
                <div className="space-y-3 w-full">
                {items.map((activity, index) => (
                    <CheckinItem 
                        key={activity.id || index} // Prefira usar o ID se vier do banco
                        checkin={activity} 
                        onClick={onCheckinClick} 
                    />
                ))}
                </div>
            </div>
            ))
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;