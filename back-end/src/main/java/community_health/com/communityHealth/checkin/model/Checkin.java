package community_health.com.communityHealth.usuario.model.checkin;

import community_health.com.communityHealth.usuario.model.Comment;
import community_health.com.communityHealth.usuario.model.Group;
import community_health.com.communityHealth.usuario.model.Reaction;
import community_health.com.communityHealth.usuario.model.user.User;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.List;

@Entity
@Table(name = "Checkins")
@Data
public class Checkin {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "group_id", nullable = false)
    private Group group;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "photo_url")
    private String photoUrl;

    // Incorpora os campos da classe CheckinMetrics aqui na tabela checkins
    @Embedded
    private CheckinMetrics metrics;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "checkin", cascade = CascadeType.ALL)
    private List<Comment> comments;

    @OneToMany(mappedBy = "checkin", cascade = CascadeType.ALL)
    private List<Reaction> reactions;
}