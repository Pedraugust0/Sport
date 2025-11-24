import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowLeft } from 'lucide-react';
import daviPhoto from '../imagens/Davi.jpeg';
// 🔑 Importar as funções de serviço de chat
import {
  connectAndSubscribe,
  sendChatMessage,
  disconnect,
  getChatHistory
} from '../services/chatService';

// Importa o ID do usuário localmente (você precisará de um Auth Context real aqui)
const CURRENT_USER_ID = 1;
const CURRENT_USER_NAME = 'Davi de Souza'; // Assumindo que o ID 1 é Davi
const CURRENT_USER_PHOTO = daviPhoto; // Foto do usuário logado

const ChatScreen = ({ group, onBack }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // 🆕 Estado para feedback visual
  const [loadingHistory, setLoadingHistory] = useState(true);

  // 🔑 NOVO ESTADO: Rastrea se o WebSocket está pronto para envio
  const [isConnected, setIsConnected] = useState(false);

  // --- Funções Auxiliares ---

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // 🆕 FUNÇÃO: Mapeia a mensagem da API para o formato da UI
  const mapApiMessageToUI = useCallback((apiMessage) => {
    const isMe = apiMessage.senderId === CURRENT_USER_ID;

    // Formatação da hora
    const date = apiMessage.createdAt instanceof Date ? apiMessage.createdAt : new Date(apiMessage.createdAt);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const time = `${hours}:${minutes}`;

    return {
      id: apiMessage.id,
      user: apiMessage.senderName || 'Desconhecido',
      userPhoto: isMe ? CURRENT_USER_PHOTO : null, // Simplificação: Apenas o seu usuário tem foto local
      text: apiMessage.content,
      time: time,
      isMe: isMe,
    };
  }, []);

  // 🆕 FUNÇÃO: Lida com novas mensagens (REST ou WebSocket)
  const handleNewMessage = useCallback((apiMessage) => {
    setMessages(prevMessages => {
      // ⚠️ Evita duplicidade se a mesma mensagem chegar via REST e WS (muito improvável, mas é bom)
      if (prevMessages.some(m => m.id === apiMessage.id)) {
        return prevMessages;
      }
      return [...prevMessages, mapApiMessageToUI(apiMessage)];
    });
  }, [mapApiMessageToUI]);

  // -------------------------------------------------------------
  // 🚀 LÓGICA PRINCIPAL DE CONEXÃO E CARREGAMENTO
  // -------------------------------------------------------------
  useEffect(() => {
    const groupId = group.id;
    if (!groupId) return;

    // Limpeza de estado e status ao trocar de grupo
    setMessages([]);
    setIsConnected(false); // Garante que o input/botão fiquem desabilitados imediatamente
    setLoadingHistory(true);

    // 1. Carrega Histórico via HTTP (REST)
    const loadHistory = async () => {
      try {
        const history = await getChatHistory(groupId);
        setMessages(history.map(mapApiMessageToUI));
      } catch (error) {
        console.error("Falha ao carregar o histórico de chat:", error);
      } finally {
        setLoadingHistory(false);
      }
    };

    // 2. Conecta ao WebSocket e Assina o Tópico
    loadHistory();
    // 🔑 Passa o novo callback para atualizar o estado isConnected
    connectAndSubscribe(
        groupId,
        handleNewMessage,
        (status) => setIsConnected(status) // Recebe true/false do chatService
    );

    // 3. CLEANUP: Desconexão do WebSocket
    return () => {
      // 🔑 Chama disconnect e usa o callback para setar isConnected = false
      disconnect(() => setIsConnected(false));
    };
  }, [group.id, mapApiMessageToUI, handleNewMessage]);

  // Role a tela para baixo sempre que as mensagens mudarem
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // --- Lógica de Envio de Mensagem ---
  const handleSendMessage = (e) => {
    e.preventDefault();
    const content = message.trim();

    // 🔑 CHECAGEM CRÍTICA: Se o botão está desabilitado, essa função NÃO DEVERIA ser chamada.
    // Mas, como segurança: se não está conectado, apenas retorna,
    // confiando que a desabilitação na UI já impede a maioria dos cliques.
    if (!content || !isConnected) {
        // 🔑 REMOÇÃO DO CONSOLE.WARN: Remove a mensagem de erro para o usuário
        return;
    }

    sendChatMessage(group.id, content);
    setMessage('');
  };

  // --- Renderização ---
  return (
    <div className="flex-1 ml-80 p-8 overflow-hidden flex flex-col relative z-20">
      <div className="mb-6">
        <button
          onClick={onBack}
          className="mb-4 w-8 h-8 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center transition-colors shadow-sm"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h2 className="text-xl font-bold text-gray-800">{group?.name || "Chat do Grupo"}</h2>
      </div>

      {/* 🔑 Feedback visual unificado: Carregando Histórico ou Conectando */}
      {(loadingHistory || !isConnected) && (
        <div className="flex justify-center items-center flex-1">
          <p className="text-gray-500">
            {loadingHistory ? "Carregando histórico..." : "Conectando ao chat..."}
          </p>
        </div>
      )}

      {/* 🔑 Renderiza as mensagens SOMENTE se o histórico tiver carregado */}
      {!loadingHistory && (
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
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: msg.isMe ? '#2E67D3' : '#6B7280' }}>
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
      )}

      <form onSubmit={handleSendMessage} className="flex-shrink-0">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            // 🔑 UX: Muda o placeholder para indicar o estado
            placeholder={isConnected ? "Adicione um comentário..." : "Conectando... Aguarde."}
            // 🔑 UX: Adiciona um estilo visual para disabled (bg-gray-200)
            className={`flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 transition-all ${!isConnected ? 'bg-gray-200 cursor-wait' : ''}`}
            style={{ borderColor: '#EDEDED' }}
            // 🔑 Desabilita a digitação se não estiver conectado
            disabled={!isConnected}
          />
          <button
            type="submit"
            // 🔑 Desabilita se não tiver mensagem OU se não estiver conectado
            disabled={!message.trim() || !isConnected}
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