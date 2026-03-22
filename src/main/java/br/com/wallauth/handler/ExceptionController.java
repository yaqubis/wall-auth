package br.com.wallauth.handler;


import br.com.wallauth.model.consts.ExceptionMessages;
import br.com.wallauth.model.exception.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.List;

@RestControllerAdvice
public class ExceptionController {

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<String> handleUserAlreadyExists(UserAlreadyExistsException e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(EmptyUserException.class)
    public ResponseEntity<String> handleEmptyUser(EmptyUserException e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<PasswordValidationException> handleValidationErrors(MethodArgumentNotValidException ex) {

        List<PasswordValidationException.FieldMessage> fieldErrors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                // Mapeia cada erro do Hibernate para o nosso modelo
                .map(f -> new PasswordValidationException.FieldMessage(f.getField(), f.getDefaultMessage()))
                .toList();

        PasswordValidationException response = new PasswordValidationException(
                LocalDateTime.now(),
                HttpStatus.BAD_REQUEST.value(),
                ExceptionMessages.VALIDATION_ERROR,
                fieldErrors
        );

        return ResponseEntity.badRequest().body(response);
    }

    @ExceptionHandler(PasswordChangeException.class)
    public ResponseEntity<String> handlePasswordChangeException(PasswordChangeException e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<String> handleUserNotFoundException(UserNotFoundException e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
    }
    
}
