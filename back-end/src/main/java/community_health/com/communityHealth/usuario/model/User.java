package community_health.com.communityHealth.usuario.model;

import community_health.com.communityHealth.group.model.GroupMember;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "Users")
@NoArgsConstructor
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

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }

    public Integer getLevel() {
        return level;
    }

    public void setLevel(Integer level) {
        this.level = level;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<GroupMember> getMemberships() {
        return memberships;
    }

    public void setMemberships(List<GroupMember> memberships) {
        this.memberships = memberships;
    }

}