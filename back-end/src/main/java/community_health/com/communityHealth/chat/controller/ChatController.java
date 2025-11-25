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

    private final SimpMessageSendingOperations messagingTemplate;
    private final GroupMessageRepository messageRepository;
    private final UserRepository userRepository;
    private final GroupRepository groupRepository;

    public ChatController(SimpMessageSendingOperations messagingTemplate,
                          GroupMessageRepository messageRepository,
                          UserRepository userRepository,
                          GroupRepository groupRepository) {
        this.messagingTemplate = messagingTemplate;
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.groupRepository = groupRepository;
    }

    // STOMP SEND para /app/group/{groupId}
    @MessageMapping("/group/{groupId}")
    public void sendGroupMessage(@DestinationVariable Long groupId, @Payload GroupMessage message) {

        // 1. Obter o ID do remetente que veio no JSON (message.sender.id)
        if (message.getSender() == null || message.getSender().getId() == null) {
            throw new RuntimeException("Remetente (senderId) é obrigatório.");
        }
        Long senderId = message.getSender().getId();

        // 2. Buscar entidades no banco
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado: " + senderId));

        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Grupo não encontrado: " + groupId));

        // 3. Preencher e Salvar
        message.setSender(sender);
        message.setGroup(group);

        // Define data se não vier preenchida (opcional, pois @CreationTimestamp resolve no banco,
        // mas para o retorno imediato do socket é bom ter)
        if (message.getCreatedAt() == null) {
            message.setCreatedAt(java.time.LocalDateTime.now());
        }

        GroupMessage savedMessage = messageRepository.save(message);

        // 4. Enviar para todos os inscritos no tópico do grupo
        messagingTemplate.convertAndSend("/topic/group/" + groupId, savedMessage);
    }

    @GetMapping("/api/v1/groups/{groupId}/chat/messages")
    @ResponseBody
    public List<GroupMessage> getChatHistory(@PathVariable Long groupId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Grupo não encontrado: " + groupId));

        return messageRepository.findByGroupOrderByCreatedAtAsc(group);
    }
}