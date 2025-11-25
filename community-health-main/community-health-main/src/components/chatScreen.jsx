import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import { getChatHistory, connectToChat, sendMessage, disconnectChat } from '../services/chatService';

const ChatScreen = ({ group, onBack, currentUser }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const messagesEndRef = useRef(null);

  // Função para formatar a mensagem vinda do Java para o formato visual do React
  const formatMessage = (msgData) => {
    const senderData = msgData.sender || {}; 
    
    const dateObj = new Date(msgData.createdAt);
    const timeString = isNaN(dateObj.getTime()) 
        ? 'Agora' 
        : dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    return {
      id: msgData.id,
      text: msgData.content,
      time: timeString,
      // Verifica se a mensagem é minha comparando IDs
      isMe: senderData.id === currentUser.id,
      user: {
        name: senderData.name || "Usuário",
        photoUrl: senderData.photoUrl
      }
    };
  };

  // 1. Carregar Histórico e Conectar WebSocket
  useEffect(() => {
    if (group && group.id) {
      setLoading(true);
      setMessages([]); // Limpa mensagens anteriores ao trocar de grupo

      // A. Busca histórico REST (Primeiro carrega o passado)
      getChatHistory(group.id)
        .then((history) => {
          const formattedHistory = history.map(formatMessage);
          setMessages(formattedHistory);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Erro ao buscar histórico:", err);
          setLoading(false);
        });

      // B. Conecta WebSocket (Para ouvir o futuro)
      connectToChat(group.id, (newMessage) => {
        // Callback: Quando chega mensagem nova do Socket
        setMessages((prevMessages) => [...prevMessages, formatMessage(newMessage)]);
      });
    }

    // C. Cleanup: Desconecta ao sair da tela ou trocar de grupo
    return () => {
      disconnectChat();
    };
  }, [group.id]); // Dependência apenas do ID do grupo

  // 2. Scroll automático para o fim da lista
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 3. Enviar Mensagem
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Envia via WebSocket (Service), passando o ID do usuário logado
    sendMessage(group.id, message, currentUser.id);
    
    // Limpa campo (a mensagem volta via socket e atualiza a lista visualmente)
    setMessage('');
  };

  return (
    <div className="flex-1 ml-80 p-8 overflow-hidden flex flex-col relative z-20 h-screen bg-gray-50">
      {/* Header do Chat */}
      <div className="mb-4 flex items-center gap-4 border-b pb-4 border-gray-200 bg-white/50 backdrop-blur-sm p-4 rounded-xl sticky top-0 z-10">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center transition-colors shadow-sm border border-gray-200"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
            <h2 className="text-xl font-bold text-gray-800">{group.name}</h2>
            <p className="text-xs text-gray-500">Chat do Grupo</p>
        </div>
      </div>

      {/* Lista de Mensagens */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2 custom-scrollbar p-2">
        {loading ? (
            <div className="flex justify-center mt-10">
                <span className="loading-spinner text-blue-500">Carregando...</span>
            </div>
        ) : messages.length === 0 ? (
            <div className="text-center mt-10 opacity-50">
                <p>Nenhuma mensagem ainda.</p>
                <p className="text-sm">Seja o primeiro a falar!</p>
            </div>
        ) : (
            messages.map((msg) => {
            const userName = msg.user?.name || 'Anônimo';
            const userPhoto = msg.user?.photoUrl;

            return (
                <div
                key={msg.id || Math.random()}
                className={`flex gap-3 ${msg.isMe ? 'flex-row-reverse' : ''} animate-fadeIn`}
                >
                {/* Avatar */}
                <div className="flex-shrink-0 self-end">
                    {userPhoto ? (
                    <img
                        src={userPhoto}
                        alt={userName}
                        className="w-8 h-8 rounded-full object-cover border border-gray-200"
                    />
                    ) : (
                    <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm" 
                        style={{ background: msg.isMe ? '#2E67D3' : '#9CA3AF' }}
                    >
                        {userName.charAt(0).toUpperCase()}
                    </div>
                    )}
                </div>

                {/* Balão de Mensagem */}
                <div className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'} max-w-[70%]`}>
                    {!msg.isMe && (
                    <span className="text-[10px] font-semibold mb-1 text-gray-500 ml-2">
                        {userName}
                    </span>
                    )}
                    <div
                    className={`px-4 py-2 rounded-2xl text-sm shadow-sm ${
                        msg.isMe
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
                    }`}
                    >
                    <p className="break-words">{msg.text}</p>
                    </div>
                    <span className="text-[10px] text-gray-400 mt-1 mx-1">{msg.time}</span>
                </div>
                </div>
            );
            })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Área de Input */}
      <form onSubmit={handleSendMessage} className="flex-shrink-0 bg-white p-2 rounded-full shadow-lg border border-gray-100 mx-4 mb-4">
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1 px-4 py-2 bg-transparent focus:outline-none text-sm text-gray-700"
          />
          <button
            type="submit"
            disabled={!message.trim()}
            className="p-2.5 rounded-full text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center bg-blue-600 shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatScreen;