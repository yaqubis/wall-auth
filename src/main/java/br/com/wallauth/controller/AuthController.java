package br.com.wallauth.controller;


import br.com.wallauth.model.dto.LoginDto;
import br.com.wallauth.model.dto.PasswordChangeDto;
import br.com.wallauth.model.dto.RegisterDto;
import br.com.wallauth.model.dto.UserDto;
import br.com.wallauth.service.UserService;
import jakarta.websocket.server.PathParam;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }
    @PostMapping("/login")
    public ResponseEntity<Void> login(@RequestBody LoginDto login){

        String token = this.userService.login(login);
        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.set("Authorization", "Bearer " + token);
        responseHeaders.set("X-Request-ID", UUID.randomUUID().toString());

        return ResponseEntity.ok()
                .headers(responseHeaders)
                .build();
    }

    @PostMapping("/register")
    public ResponseEntity<Void> register(@RequestBody RegisterDto user) {
        this.userService.createUser(user);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PatchMapping("/password")
    public ResponseEntity<Void> changePassword(@PathParam("user.id") Long id, @RequestBody PasswordChangeDto passwordChangeDto) {
        this.userService.changePassword(passwordChangeDto);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
