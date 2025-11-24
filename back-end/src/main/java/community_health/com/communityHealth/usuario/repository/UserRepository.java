// src/main/java/community_health/com/communityHealth/usuario/repository/UserRepository.java

package community_health.com.communityHealth.usuario.repository;

import community_health.com.communityHealth.usuario.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

// ✅ Correto: O ID do User é Long
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
}