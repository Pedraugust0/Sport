package community_health.com.communityHealth.group.dto;


// Assumimos Long, baseado no ownerId=1.
public record RankingDto(
        Long userId,
        String userName,
        String userPhoto,
        long totalCheckins,
        long activeDays
) {}