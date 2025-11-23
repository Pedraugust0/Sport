package community_health.com.communityHealth.chat.model;

import community_health.com.communityHealth.checkin.model.Checkin;
import community_health.com.communityHealth.usuario.model.User;
import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;

@Entity
@Table(
        name = "reactions",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"checkin_id", "user_id", "emoji_type"})
        }
)
@Data
public class Reaction {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "checkin_id", nullable = false)
    private Checkin checkin;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "emoji_type", nullable = false)
    private String emojiType; // Ex: "❤️", "🔥"
}