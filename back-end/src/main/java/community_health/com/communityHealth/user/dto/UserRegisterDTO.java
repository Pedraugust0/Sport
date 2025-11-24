package community_health.com.communityHealth.user.dto;

public record UserRegisterDTO(
        String name,
        Integer idade,
        String cidade,
        String email,
        String password
) {}