package br.com.wallauth.service.impl;

import br.com.wallauth.model.User;
import br.com.wallauth.model.consts.ExceptionMessages;
import br.com.wallauth.model.dto.LoginDto;
import br.com.wallauth.model.dto.PasswordChangeDto;
import br.com.wallauth.model.dto.RegisterDto;
import br.com.wallauth.model.dto.UserDto;
import br.com.wallauth.model.exception.*;
import br.com.wallauth.repository.UserRepository;
import br.com.wallauth.service.JwtService;
import br.com.wallauth.service.UserService;
import lombok.extern.log4j.Log4j2;
import org.jspecify.annotations.NullMarked;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;
import java.util.Optional;

@Log4j2
@Service
public class UserServiceImpl implements UserService {

    private final UserRepository repository;
    private final PasswordEncoder encoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public UserServiceImpl(UserRepository repository, PasswordEncoder encoder, AuthenticationManager authenticationManager, JwtService jwtService) {
        this.repository = repository;
        this.encoder = encoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }
    
    @NullMarked
    @Override
    public UserDetails loadUserByUsername( String username) throws UsernameNotFoundException {
        return repository.findByUsername(username).orElseThrow();
    }

    @Transactional
    @Override
    public UserDto createUser(RegisterDto user) {
        this.validateUserCreation(user);

        User userEntity = user.fromDto();
        userEntity.setPassword(encoder.encode(userEntity.getPassword()));

        User savedUser = this.repository.save(userEntity);
        return UserDto.fromEntity(savedUser);
    }

    @Transactional
    @NullMarked
    @Override
    public void changePassword(PasswordChangeDto passwordChangeDto) {

      User passwordChange = this.changePasswordValidation(passwordChangeDto.id(), passwordChangeDto.oldPassword(), passwordChangeDto.newPassword());
      repository.save(passwordChange);
    }


    @Transactional
    @Override
    public String login(LoginDto login) {

        var authenticationToken = new UsernamePasswordAuthenticationToken(login.username(), login.password());

        var authentication = authenticationManager.authenticate(authenticationToken);

        return this.jwtService.generateToken(Objects.requireNonNull(authentication.getPrincipal()).toString());

    }

    private void validateUserCreation(RegisterDto user) {
        if (Objects.isNull(user)) {
            throw new EmptyUserException(ExceptionMessages.EMPTY_USER);
        }

        if (repository.existsUserByUsername(user.username())) {
            throw new UserAlreadyExistsException(ExceptionMessages.USER_ALREADY_EXISTS);
        }

        if (repository.existsUserByEmail(user.email())) {
            throw new UserAlreadyExistsException(ExceptionMessages.USER_EMAIL_ALREADY_USED);
        }
    }

    private User changePasswordValidation(Long id, String oldPassword, String newPassword) {

        if (oldPassword.isBlank()) {
            throw new PasswordChangeException(ExceptionMessages.OLD_PASSWORD_EMPTY);
        }

        if (newPassword.isBlank()) {
            throw new PasswordChangeException(ExceptionMessages.NEW_PASSWORD_EMPTY);
        }

        String newPasswordEncoded = encoder.encode(newPassword);

        if (oldPassword.equals(newPasswordEncoded)) {
            throw new PasswordChangeException(ExceptionMessages.OLD_PASSWORD_EQUALS_NEW);
        }

      Optional<User> userToSave = repository.findById(id);

       if (userToSave.isEmpty()) {
           throw new UserNotFoundException(ExceptionMessages.USER_NOT_FOUND);
       }


       userToSave.get().setPassword(encoder.encode(newPasswordEncoded));

       return userToSave.get();
    }

}
