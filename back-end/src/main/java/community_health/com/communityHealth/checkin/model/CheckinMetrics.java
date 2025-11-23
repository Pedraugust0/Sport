package community_health.com.communityHealth.checkin.model;

// CheckinMetrics.java
// Usamos @Embeddable para que esses campos fiquem na tabela 'checkins'
// mas agrupados num objeto Java.
import jakarta.persistence.Embeddable;
import jakarta.persistence.Column;
import lombok.Data;

@Embeddable
@Data
public class CheckinMetrics {

    @Column(name = "metric_distance_km")
    private Double distanceKm;

    @Column(name = "metric_duration_min")
    private Integer durationMin;

    @Column(name = "metric_steps")
    private Integer steps;
}