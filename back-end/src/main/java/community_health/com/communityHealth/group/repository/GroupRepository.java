package community_health.com.communityHealth.group.repository;

import community_health.com.communityHealth.group.model.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import java.util.List;

@Repository
public interface GroupRepository extends JpaRepository<Group, Long> { // <-- CORREÇÃO APLICADA AQUI

    // Exemplo: Encontrar todos os grupos que não são privados
    List<Group> findByIsPrivateFalse();

    // Exemplo: Encontrar grupos pelo ID do Owner (Long)
    // O ID do Owner é Long, então este método está correto:
    List<Group> findByOwnerId(Long ownerId);
}