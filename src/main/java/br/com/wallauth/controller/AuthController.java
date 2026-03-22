package br.com.wallauth.controller;


import br.com.wallauth.model.dto.PasswordChangeDto;
import br.com.wallauth.model.dto.RegisterDto;
import br.com.wallauth.model.dto.UserDto;
import br.com.wallauth.service.UserService;
import jakarta.websocket.server.PathParam;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public String login(){

        return "";
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
