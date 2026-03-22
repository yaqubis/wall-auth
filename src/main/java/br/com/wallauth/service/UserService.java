package br.com.wallauth.service;

import br.com.wallauth.model.dto.PasswordChangeDto;
import br.com.wallauth.model.dto.RegisterDto;
import br.com.wallauth.model.dto.UserDto;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface UserService extends UserDetailsService {
    UserDto createUser(RegisterDto user);
    void changePassword(PasswordChangeDto passwordChangeDto);


}
