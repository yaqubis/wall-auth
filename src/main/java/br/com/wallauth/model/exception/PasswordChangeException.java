package br.com.wallauth.model.exception;

public class PasswordChangeException extends RuntimeException{

    public PasswordChangeException(String message) {
        super(message);
    }
}
