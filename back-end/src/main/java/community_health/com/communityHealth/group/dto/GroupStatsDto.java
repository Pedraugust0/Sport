package community_health.com.communityHealth.group.dto;

import lombok.Data;

@Data
public class GroupStatsDto {
    private Integer totalCheckins;
    private Integer totalActiveDays;
    private Double avgCheckinsPerDay;

    // Construtor, Getters e Setters (via @Data do Lombok)
}