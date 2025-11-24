package community_health.com.communityHealth.user.dto;

import java.time.LocalDateTime;

public record UserResponseDTO(
        Long id,
        String name,
        Integer idade,
        String cidade,
        String email,
        String photoUrl,
        Integer level,
        LocalDateTime createdAt
) {}