package community_health.com.communityHealth.group.repository;

import community_health.com.communityHealth.group.model.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query; // 🆕 Import necessário
import org.springframework.data.repository.query.Param; // 🆕 Import necessário
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupRepository extends JpaRepository<Group, Long> {

    // Seus métodos existentes (pode manter):
    List<Group> findByIsPrivateFalse();
    List<Group> findByOwnerId(Long ownerId);

    @Query("SELECT DISTINCT g FROM Group g " +
            "LEFT JOIN g.members m " +
            "WHERE g.owner.id = :userId OR m.user.id = :userId")
    List<Group> findMyGroups(@Param("userId") Long userId);
}