package community_health.com.communityHealth.checkin.model;

import community_health.com.communityHealth.group.model.Group;
import community_health.com.communityHealth.user.model.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "Checkins")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Checkin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "titulo_atividade", nullable = false)
    private String tituloAtividade;

    // 🆕 NOVO CAMPO: URL da foto do Check-in
    @Column(name = "photo_url")
    private String photoUrl;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Embedded
    private CheckinMetrics metricas;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // --- Relacionamentos Obrigatórios ---

    // 🆕 Relacionamento com o Usuário que fez o Check-in
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Relacionamento com o Grupo (EAGER para evitar o erro de Proxy na listagem)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "group_id", nullable = false)
    private Group group;

    // 🆕 Relacionamento com Comentários (Lazy e JsonIgnore para quebrar o ciclo)
    @JsonIgnore
    @OneToMany(mappedBy = "checkin", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments;
}