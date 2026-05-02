package br.com.wallauth.model.dto;

import lombok.ToString;

public record LoginDto(
        String username,
        String password) {


    @Override
    public String toString() {
        return "LoginDto{" +
                "username='" + username + '\'' +
                ", password='" + password + '\'' +
                '}';
    }
}
