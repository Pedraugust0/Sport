// src/main/java/community_health/com/communityHealth/chat/model/GroupMessage.java

package community_health.com.communityHealth.chat.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties; // 🔑 NOVA IMPORTAÇÃO
import community_health.com.communityHealth.group.model.Group;
import community_health.com.communityHealth.user.model.User;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;


@Entity
@Table(name = "Group_Messages")
@Data
public class GroupMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 🔑 CORREÇÃO: Ignora as coleções Lazy dentro de Group para evitar ciclos
    // Assumimos que 'members' e 'checkins' são Lazy collections dentro de Group.java
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id", nullable = false)
    @JsonIgnoreProperties({"members", "checkins"})
    private Group group;

    // 🔑 CORREÇÃO: Ignora as coleções Lazy dentro de User para evitar o erro específico:
    // User.memberships (e outras como checkins ou groups_owned)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "sender_id", nullable = false)
    @JsonIgnoreProperties({"memberships", "checkins", "ownedGroups"}) // Ajuste os nomes das coleções do User aqui
    private User sender;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}