package community_health.com.communityHealth.usuario.repository;

import community_health.com.communityHealth.usuario.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
}
