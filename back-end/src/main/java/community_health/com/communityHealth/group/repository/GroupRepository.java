package community_health.com.communityHealth.group.repository;

import community_health.com.communityHealth.group.model.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;
import java.util.List;

@Repository
// MUDANÇA CRÍTICA: O JpaRepository deve usar UUID, não Long.
public interface GroupRepository extends JpaRepository<Group, UUID> { // <-- CORREÇÃO AQUI

    // Exemplo: Encontrar todos os grupos que não são privados
    List<Group> findByIsPrivateFalse();

    // Exemplo: Encontrar grupos pelo ID do Owner
    // Se o ID do Owner for Long (como parece estar no seu GroupService), isso está OK.
    List<Group> findByOwnerId(Long ownerId);
}