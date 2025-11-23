package community_health.com.communityHealth.checkin.model;

import jakarta.persistence.Embeddable;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

// Marca que esta classe pode ser embutida em outras entidades
@Embeddable
@Data // Gera Getters, Setters, toString, equals, hashCode (Lombok)
@NoArgsConstructor
@AllArgsConstructor
public class CheckinMetrics {

    // Distância percorrida (km)
    private Double distanciaKm;

    // Duração da atividade (minutos)
    private Integer duracaoMin;

    // Número de passos
    private Integer passos;
}