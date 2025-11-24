package community_health.com.communityHealth.usuario.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import community_health.com.communityHealth.group.model.GroupMember;
import jakarta.persistence.*;
import lombok.*; // Importa todas as anotações do Lombok
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "Users")
@Getter // 🔑 Implementa todos os getters automaticamente
@Setter // 🔑 Implementa todos os setters automaticamente
@NoArgsConstructor // Implementa o construtor sem argumentos
@AllArgsConstructor // Implementa um construtor com todos os argumentos
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
    // 🔑 MANTIDO: O @JsonIgnore é crucial para evitar o LazyInitializationException
    // quando o Jackson tenta serializar o GroupMessage.
    @JsonIgnore
    @OneToMany(mappedBy = "user")
    private List<GroupMember> memberships;

    /*
    // 🔑 REMOÇÃO: Os construtores manuais abaixo são agora cobertos por @NoArgsConstructor e @AllArgsConstructor
    // Se você precisar de um construtor específico, use @RequiredArgsConstructor ou @AllArgsConstructor(onlyExplicitlyIncluded = true)

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

    // 🔑 REMOÇÃO: Todos os Getters e Setters manuais foram removidos.
    */
}