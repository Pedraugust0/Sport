// src/main/java/community_health/com/communityHealth/chat/repository/GroupMessageRepository.java

package community_health.com.communityHealth.chat.repository;

import community_health.com.communityHealth.chat.model.GroupMessage;
import community_health.com.communityHealth.group.model.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;


// O ID da própria GroupMessage é Long (Correto)
public interface GroupMessageRepository extends JpaRepository<GroupMessage, Long> {

    // 🔑 Método 1 (Correto, busca usando o objeto Group que tem Long como PK)
    List<GroupMessage> findByGroupOrderByCreatedAtAsc(Group group);

    // 🔑 Método 2 (CORRIGIDO: O ID do Grupo deve ser Long, e não UUID)
    List<GroupMessage> findByGroupIdOrderByCreatedAtAsc(Long groupId); // ⬅️ MUDANÇA AQUI!
}