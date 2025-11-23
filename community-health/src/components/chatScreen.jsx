import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import daviPhoto from '../imagens/Davi.jpeg';

const ChatScreen = ({ group, onBack }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      user: 'Carlos Silva',
      userPhoto: null,
      text: 'Boa galera! Vamos manter o foco! 💪',
      time: '10:30',
      isMe: false,
    },
    {
      id: 2,
      user: 'Davi de Souza',
      userPhoto: daviPhoto,
      text: 'Fiz minha corrida hoje! 5km 🏃‍♂️',
      time: '11:15',
      isMe: true,
    },
    {
      id: 3,
      user: 'Carlos Silva',
      userPhoto: null,
      text: 'Muito bom! Continua assim 👏',
      time: '11:20',
      isMe: false,
    },
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const currentTime = `${hours}:${minutes}`;

    const newMessage = {
      id: messages.length + 1,
      user: 'Davi de Souza',
      userPhoto: daviPhoto,
      text: message,
      time: currentTime,
      isMe: true,
    };

    setMessages([...messages, newMessage]);
    setMessage('');
  };

  return (
    <div className="flex-1 ml-80 p-8 overflow-hidden flex flex-col relative z-20">
      <div className="mb-6">
        <button
          onClick={onBack}
          className="mb-4 w-8 h-8 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center transition-colors shadow-sm"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 mb-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.isMe ? 'flex-row-reverse' : ''}`}
          >
            <div className="flex-shrink-0">
              {msg.userPhoto ? (
                <img
                  src={msg.userPhoto}
                  alt={msg.user}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: '#2E67D3' }}>
                  {msg.user.charAt(0)}
                </div>
              )}
            </div>

            <div className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'} max-w-[70%]`}>
              {!msg.isMe && (
                <span className="text-xs font-semibold mb-1" style={{ color: '#212121' }}>
                  {msg.user}
                </span>
              )}
              <div
                className={`px-5 py-3 rounded-3xl ${
                  msg.isMe
                    ? 'text-white shadow-md'
                    : 'bg-white text-gray-800 shadow-sm'
                }`}
                style={msg.isMe ? { background: '#2E67D3' } : {}}
              >
                <p className="text-sm">{msg.text}</p>
              </div>
              <span className="text-xs text-gray-500 mt-1">{msg.time}</span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="flex-shrink-0">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Adicione um comentário..."
            className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 transition-all"
            style={{ borderColor: '#EDEDED', backgroundColor: '#FFFFFF' }}
          />
          <button
            type="submit"
            disabled={!message.trim()}
            className="px-6 py-2 text-white rounded-full font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: '#2E67D3' }}
          >
            Enviar
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatScreen;