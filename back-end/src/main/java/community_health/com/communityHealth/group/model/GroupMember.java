package community_health.com.communityHealth.group.model;

import community_health.com.communityHealth.usuario.model.Role;
import community_health.com.communityHealth.usuario.model.User;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;


@Entity
@Table(name = "Group_Members")
@Data
public class GroupMember {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "group_id", nullable = false)
    private Group group;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role; // ADMIN ou MEMBER

    @CreationTimestamp
    @Column(name = "joined_at", updatable = false)
    private LocalDateTime joinedAt;

    // Cache para performance do Ranking
    @Column(name = "cached_checkin_count")
    private Integer cachedCheckinCount = 0;

    @Column(name = "cached_active_days")
    private Integer cachedActiveDays = 0;
}