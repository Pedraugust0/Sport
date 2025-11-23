package community_health.com.communityHealth.checkin.repository;

import community_health.com.communityHealth.checkin.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    // Método para buscar todos os comentários de um Check-in
    List<Comment> findByCheckinIdOrderByCreatedAtAsc(Long checkinId);
}