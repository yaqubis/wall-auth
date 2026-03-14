package br.com.wallauth.controller;


import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthController {



    @PostMapping("/login")
    public void login(){

    }

    @PostMapping("/register")
    public void register() {

    }

}
