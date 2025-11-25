// src/main/java/community_health/com/communityHealth/usuario/repository/UserRepository.java

package community_health.com.communityHealth.user.repository;

import community_health.com.communityHealth.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
}