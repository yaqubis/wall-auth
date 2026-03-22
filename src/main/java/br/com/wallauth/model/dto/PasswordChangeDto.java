package br.com.wallauth.model.dto;

public record PasswordChangeDto(
        Long id,
        String oldPassword,
        String newPassword
) {

}
