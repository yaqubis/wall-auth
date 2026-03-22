package br.com.wallauth.model.exception;

public class EmptyUserException extends RuntimeException{
    public EmptyUserException(String message) {
        super(message);
    }
}
