package br.com.wallauth.model.exception;

import java.time.LocalDateTime;
import java.util.List;

public record PasswordValidationException(
        LocalDateTime timestamp,
        int status,
        String error,
        List<FieldMessage> errors) {

    public record FieldMessage(String field, String message) {}
}
