package community_health.com.communityHealth.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UserUpdateDTO(
        @NotBlank String name,
        @NotNull Integer idade,
        @NotBlank String cidade,
        @NotBlank @Email String email,
        @NotNull Integer level,
        String photoUrl
) {}