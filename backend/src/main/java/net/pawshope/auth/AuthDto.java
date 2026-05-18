package net.pawshope.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class AuthDto {

    public record RegisterRequest(
            @NotBlank @Size(min = 3, max = 50)
            @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "Username chỉ chứa chữ, số, _")
            String username,

            @NotBlank @Size(min = 6, max = 72)
            String password,

            @NotBlank @Size(min = 2, max = 100)
            String fullName,

            @NotBlank @Email
            String email,

            @Size(min = 10, max = 20)
            String phone
    ) {}

    public record LoginRequest(
            @NotBlank String username,
            @NotBlank String password
    ) {}

    public record UserResponse(
            long userId,
            String username,
            String fullName,
            String email,
            String phone,
            String role,
            int status,
            String createdAt
    ) {}

    public record LoginResponse(UserResponse user, String token) {}
}
