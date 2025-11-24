package community_health.com.communityHealth.checkin.repository;

import community_health.com.communityHealth.checkin.model.Checkin;
import community_health.com.communityHealth.group.dto.RankingDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
// O JpaRepository fornece métodos CRUD básicos (save, findById, findAll, delete)
public interface CheckinRepository extends JpaRepository<Checkin, Long> {

    // Você pode adicionar métodos customizados aqui, se precisar
    // Ex: List<Checkin> findByUsuarioId(Long usuarioId);
    List<Checkin> findByGroupId(Long groupId);

    @Query("""
    SELECT new community_health.com.communityHealth.group.dto.RankingDto(
        c.user.id,
        c.user.name,
        c.user.photoUrl,
        COUNT(c.id),
        COUNT(DISTINCT FUNCTION('DAY', c.createdAt))
    )
    FROM Checkin c
    WHERE c.group.id = :groupId
    GROUP BY c.user.id, c.user.name, c.user.photoUrl
    ORDER BY COUNT(c.id) DESC
""")
    List<RankingDto> findRankingByGroupId(@Param("groupId") Long groupId);
}