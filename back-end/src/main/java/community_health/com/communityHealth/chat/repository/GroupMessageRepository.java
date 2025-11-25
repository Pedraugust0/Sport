package community_health.com.communityHealth.chat.repository;

import community_health.com.communityHealth.chat.model.GroupMessage;
import community_health.com.communityHealth.group.model.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface GroupMessageRepository extends JpaRepository<GroupMessage, Long> {
    List<GroupMessage> findByGroupOrderByCreatedAtAsc(Group group);
}