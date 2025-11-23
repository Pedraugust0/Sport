package community_health.com.communityHealth.checkin.repository;

import community_health.com.communityHealth.checkin.model.Checkin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
// O JpaRepository fornece métodos CRUD básicos (save, findById, findAll, delete)
public interface CheckinRepository extends JpaRepository<Checkin, Long> {

    // Você pode adicionar métodos customizados aqui, se precisar
    // Ex: List<Checkin> findByUsuarioId(Long usuarioId);
    List<Checkin> findByGroupId(UUID groupId);
}