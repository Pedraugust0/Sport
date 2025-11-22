package community_health.com.communityHealth.usuario.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "Users")
@NoArgsConstructor
@Getter
@Setter
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "photo_url")
    private String photoUrl;

    private Integer level;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // Relacionamentos inversos (opcional, mas útil para queries)
    @OneToMany(mappedBy = "user")
    private List<GroupMember> memberships;

    public User(String name, String email, String passwordHash, Integer level, LocalDateTime createdAt) {
        this.name = name;
        this.email = email;
        this.passwordHash = passwordHash;
        this.level = level;
        this.createdAt = createdAt;
    }

    public User(String name, String email, String passwordHash, Integer level, LocalDateTime createdAt, List<GroupMember> memberships) {
        this.name = name;
        this.email = email;
        this.passwordHash = passwordHash;
        this.level = level;
        this.createdAt = createdAt;
        this.memberships = memberships;
    }


}