// src/services/chatService.js

import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

// 🔑 URL base do seu backend Spring Boot
const API_BASE_URL = 'http://localhost:8080/api/v1';
const WS_URL = 'http://localhost:8080/ws'; // Endpoint definido no WebSocketConfig.java

let stompClient = null; // Instância global do cliente STOMP

/**
 * 1. Busca o Histórico de Mensagens via HTTP (REST)
 */
export const getChatHistory = async (groupId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/groups/${groupId}/chat/messages`);

        if (!response.ok) {
            throw new Error(`Erro ao buscar histórico: ${response.statusText}`);
        }

        const history = await response.json();

        // Mapeia dados da API para o formato da UI
        return history.map(msg => ({
            id: msg.id,
            content: msg.content,
            // Assumindo que o Spring retorna o objeto 'sender' com 'name'
            senderName: msg.sender ? msg.sender.name : 'Desconhecido',
            senderId: msg.sender ? msg.sender.id : null,
            createdAt: new Date(msg.createdAt),
        })).sort((a, b) => a.createdAt - b.createdAt); // Ordena por data
    } catch (error) {
        console.error("Falha ao carregar histórico do chat:", error);
        throw error;
    }
};

/**
 * 2. Conecta ao WebSocket e Assina o Tópico do Grupo
 */
export const connectAndSubscribe = (groupId, onMessageReceived) => {

    // 🔑 CORREÇÃO PARA "Stomp.over is not a constructor"
    // Verifica se a exportação default está aninhada (comum em bundlers)
    const StompClient = Stomp.Stomp ? Stomp.Stomp : Stomp;

    // Agora StompClient.over deve ser uma função válida
    stompClient = StompClient.over(function() {
        return new SockJS(WS_URL);
    });

    stompClient.connect({}, (frame) => {
        console.log('Conectado ao WebSocket:', frame);

        // 🔑 Assina o tópico do BROKER para o grupo específico: /topic/group/{groupId}
        stompClient.subscribe(`/topic/group/${groupId}`, (message) => {
            const newMessage = JSON.parse(message.body);

            // Mapeia e envia para o componente React
            onMessageReceived({
                id: newMessage.id,
                content: newMessage.content,
                senderName: newMessage.sender ? newMessage.sender.name : 'Desconhecido',
                senderId: newMessage.sender ? newMessage.sender.id : null,
                createdAt: new Date(newMessage.createdAt),
            });
        });
    }, (error) => {
        console.error('Erro STOMP/WebSocket:', error);
    });
};

/**
 * 3. Envia uma Mensagem para o Controller (STOMP SEND)
 */
export const sendChatMessage = (groupId, content) => {
    if (stompClient && stompClient.connected) {
        const chatMessage = {
            content: content,
            // Não precisa incluir senderId aqui, o backend o obterá da sessão/simulação
        };

        // 🔑 Envia para o destino da aplicação: /app/group/{groupId}
        stompClient.send(`/app/group/${groupId}`, {}, JSON.stringify(chatMessage));
    } else {
        console.error("Cliente STOMP não está conectado. Tente recarregar o chat.");
    }
};

/**
 * 4. Desconecta o WebSocket
 */
export const disconnect = () => {
    if (stompClient && stompClient.connected) {
        stompClient.disconnect(() => {
            console.log("Desconectado do WebSocket.");
            stompClient = null;
        });
    }
};