package br.com.wallauth.model.dto;

import br.com.wallauth.model.Role;
import br.com.wallauth.model.User;
import lombok.Builder;

import java.util.UUID;

@Builder
public record UserDto(
        UUID id,
        String password,
        String email,
        Role role
) {
    public static UserDto fromEntity(User user) {
        return UserDto.builder()
                .id(user.getId())
                .password(user.getPassword())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

    public User fromDto() {
        return User.builder()
                .id(id)
                .password(password)
                .email(email)
                .role(role)
                .build();
    }

}
