package br.com.wallauth.model.dto;

import java.util.UUID;

public record PasswordChangeDto(
        UUID id,
        String oldPassword,
        String newPassword
) {

}
