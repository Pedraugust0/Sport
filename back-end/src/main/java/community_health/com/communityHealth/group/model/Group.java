package community_health.com.communityHealth.group.model;

import community_health.com.communityHealth.checkin.model.Checkin;
import community_health.com.communityHealth.usuario.model.User;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.UUID;
import java.util.List;

@Entity
@Table(name = "Groups")
@Data
public class Group {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "duration_days", nullable = false)
    private Integer durationDays;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "is_private")
    private Boolean isPrivate;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // --- Relacionamentos ---
    @OneToMany(mappedBy = "group")
    private List<GroupMember> members;

    @OneToMany(mappedBy = "group")
    private List<Checkin> checkins;

    // --- Lógica Calculada (Não vai para o Banco) ---
    @Transient
    public long getDaysRemaining() {
        if (startDate == null) return durationDays;

        LocalDateTime endDate = startDate.plusDays(durationDays);
        long days = ChronoUnit.DAYS.between(LocalDateTime.now(), endDate);

        return days > 0 ? days : 0;
    }
}