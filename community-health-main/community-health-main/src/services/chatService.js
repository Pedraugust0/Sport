import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const BASE_URL = "http://localhost:8080"; 
const WS_ENDPOINT = `${BASE_URL}/ws`; 

let stompClient = null;

/**
 * Busca o histórico via REST
 */
export async function getChatHistory(groupId) {
    const res = await fetch(`${BASE_URL}/api/v1/groups/${groupId}/chat/messages`);
    if (!res.ok) throw new Error("Erro ao carregar histórico.");
    return res.json();
}

/**
 * Conecta ao WebSocket com proteção contra chamadas duplas
 */
export function connectToChat(groupId, onMessageReceived) {
    // Se já existe um cliente tentando conectar ou conectado, não faz nada
    if (stompClient && stompClient.ws && stompClient.ws.readyState !== WebSocket.CLOSED) {
        console.log("Já existe uma conexão ativa ou em andamento.");
        return;
    }

    const socket = new SockJS(WS_ENDPOINT);
    stompClient = Stomp.over(socket);
    stompClient.debug = null; // Desativa logs no console

    stompClient.connect({}, () => {
        // Callback de Sucesso
        // Verifica se ainda estamos conectados antes de tentar subscrever
        if (stompClient && stompClient.connected) {
            stompClient.subscribe(`/topic/group/${groupId}`, (messageOutput) => {
                const message = JSON.parse(messageOutput.body);
                onMessageReceived(message);
            });
        }
    }, (error) => {
        console.warn("Erro de conexão ou desconexão forçada:", error);
    });
}

/**
 * Envia mensagem com verificação de segurança
 */
export function sendMessage(groupId, content, senderId) {
    if (stompClient && stompClient.connected) {
        const chatMessage = {
            content: content,
            sender: { id: senderId }
        };
        stompClient.send(`/app/group/${groupId}`, {}, JSON.stringify(chatMessage));
    } else {
        console.error("Não foi possível enviar: Chat desconectado.");
    }
}

/**
 * Desconecta com segurança para evitar InvalidStateError
 */
export function disconnectChat() {
    if (stompClient) {
        try {
            // Só tenta mandar o frame de DISCONNECT se estiver realmente conectado
            if (stompClient.connected) {
                stompClient.disconnect(() => {
                    console.log("Desconectado com sucesso.");
                });
            } else if (stompClient.ws) {
                // Se estava tentando conectar (CONNECTING), fecha o socket na força bruta
                // para evitar o erro "InvalidStateError"
                stompClient.ws.close();
            }
        } catch (e) {
            console.warn("Erro ao tentar desconectar:", e);
        }
        stompClient = null;
    }
}