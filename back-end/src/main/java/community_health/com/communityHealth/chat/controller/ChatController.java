// src/main/java/community_health/com/communityHealth/chat/controller/ChatController.java

package community_health.com.communityHealth.chat.controller;

import community_health.com.communityHealth.chat.model.GroupMessage;
import community_health.com.communityHealth.chat.repository.GroupMessageRepository;
import community_health.com.communityHealth.group.model.Group;
import community_health.com.communityHealth.group.repository.GroupRepository;
import community_health.com.communityHealth.user.model.User;
import community_health.com.communityHealth.user.repository.UserRepository;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
public class ChatController {

    // DECLARAÇÃO DOS CAMPOS (FINAL FIELDS)
    private final SimpMessageSendingOperations messagingTemplate;
    private final GroupMessageRepository messageRepository;
    private final UserRepository userRepository;
    private final GroupRepository groupRepository;

    // CONSTRUTOR DE INJEÇÃO DE DEPENDÊNCIA
    public ChatController(SimpMessageSendingOperations messagingTemplate,
                          GroupMessageRepository messageRepository,
                          UserRepository userRepository,
                          GroupRepository groupRepository) {
        this.messagingTemplate = messagingTemplate;
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.groupRepository = groupRepository;
    }

    // RECEBE MENSAGENS DO CLIENTE (STOMP SEND para /app/group/{groupId})
    @MessageMapping("/group/{groupId}")
    public void sendGroupMessage(@DestinationVariable Long groupId, @Payload GroupMessage message) {

        Long currentUserId = 1L; // EXEMPLO: ID é Long (Correto para este controller)

        // 1. Busca as entidades
        // 🔑 Linha 58 (userRepository.findById(currentUserId))
        User sender = userRepository.findById(currentUserId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado: " + currentUserId));

        // 🔑 Linha 61 (groupRepository.findById(groupId))
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Grupo não encontrado: " + groupId));


        // 2. Preenche o objeto
        message.setSender(sender);
        message.setGroup(group);

        // 3. Salva a mensagem no banco
        GroupMessage savedMessage = messageRepository.save(message);

        // 4. Envia para o BROKER
        messagingTemplate.convertAndSend("/topic/group/" + groupId, savedMessage);
    }

    // Endpoint REST para buscar o histórico (HTTP GET)
    @GetMapping("/api/v1/groups/{groupId}/chat/messages")
    @ResponseBody
    public List<GroupMessage> getChatHistory(@PathVariable Long groupId) {

        // 1. Busca a entidade Group
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Grupo não encontrado: " + groupId));

        // 2. Retorna a lista de mensagens para o grupo
        return messageRepository.findByGroupOrderByCreatedAtAsc(group);
    }
}