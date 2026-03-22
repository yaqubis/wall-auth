package br.com.wallauth.model.dto;

import br.com.wallauth.model.Role;
import br.com.wallauth.model.User;
import lombok.Builder;

@Builder
public record UserDto(
        Long id,
        String username,
        String password,
        String email,
        Role role
) {
    public static UserDto fromEntity(User user) {
        return UserDto.builder()
                .id(user.getId())
                .password(user.getPassword())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

    public User fromDto() {
        return User.builder()
                .id(id)
                .username(username)
                .password(password)
                .email(email)
                .role(role)
                .build();
    }

}
