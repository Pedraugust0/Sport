package community_health.com.communityHealth.checkin.repository;

import community_health.com.communityHealth.checkin.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    // Método para buscar todos os comentários de um Check-in
    List<Comment> findByCheckinIdOrderByCreatedAtAsc(Long checkinId);

    // 🆕 Novo método: Procura por uma reação específica de um usuário em um check-in
    Optional<Comment> findByCheckinIdAndUserIdAndReactionEmoji(Long checkinId, Long userId, String reactionEmoji);
}