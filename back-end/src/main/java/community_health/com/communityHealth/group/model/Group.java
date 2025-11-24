package community_health.com.communityHealth.group.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import community_health.com.communityHealth.checkin.model.Checkin;
import community_health.com.communityHealth.user.model.User;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

import java.util.List;

@Entity
@Table(name = "`Groups`") // deixe as `` pois a bomba do mysql usa groups como palavra reservada, ai o ` resolve
@Data
public class Group {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @OneToMany(mappedBy = "group")
    private List<GroupMember> members;

    // ANOTAÇÃO PARA QUEBRAR O CICLO: Não serialize os checkins ao serializar o Grupo
    @JsonIgnore
    @OneToMany(mappedBy = "group")
    private List<Checkin> checkins;

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

    // --- Lógica Calculada (Não vai para o Banco) ---
    @Transient
    public long getDaysRemaining() {
        if (startDate == null) return durationDays;

        LocalDateTime endDate = startDate.plusDays(durationDays);
        long days = ChronoUnit.DAYS.between(LocalDateTime.now(), endDate);

        return days > 0 ? days : 0;
    }
}