package br.com.wallauth.model.dto;

import br.com.wallauth.model.Role;
import br.com.wallauth.model.User;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Builder;

@Builder
public record RegisterDto(
        @NotBlank
        @Size(min = 8, max = 100)
        @Pattern(
                regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,}$",
                message = "A senha deve conter letras maiúsculas, minúsculas, números e caracteres especiais."
        )
        String password,
        String email,
        Role role
) {
    public static RegisterDto fromEntity(User user) {
        return RegisterDto.builder()
                .password(user.getPassword())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

    public User fromDto() {
        return User.builder()
                .password(password)
                .email(email)
                .role(role)
                .build();
    }

}
