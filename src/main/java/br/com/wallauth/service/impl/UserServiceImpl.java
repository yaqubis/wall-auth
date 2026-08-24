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
import org.springframework.context.annotation.Lazy;
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
import java.util.UUID;

@Log4j2
@Service
public class UserServiceImpl implements UserService {

    private final UserRepository repository;
    private final PasswordEncoder encoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public UserServiceImpl(UserRepository repository, PasswordEncoder encoder, @Lazy AuthenticationManager authenticationManager, JwtService jwtService) {
        this.repository = repository;
        this.encoder = encoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }
    
    @Override
    public UserDetails loadUserByUsername( String username) throws UsernameNotFoundException {
        return repository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
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
    @Override
    public void changePassword(PasswordChangeDto passwordChangeDto) {

      User passwordChange = this.changePasswordValidation(passwordChangeDto.id(), passwordChangeDto.newPassword());
      repository.save(passwordChange);
    }


    @Transactional
    @Override
    public String login(LoginDto login) {

        var authenticationToken = new UsernamePasswordAuthenticationToken(login.username(), login.password());

        var authentication = authenticationManager.authenticate(authenticationToken);

        return this.jwtService.generateToken(String.valueOf(authentication.getPrincipal()));

    }

    private void validateUserCreation(RegisterDto user) {
        if (Objects.isNull(user)) {
            throw new EmptyUserException(ExceptionMessages.EMPTY_USER);
        }

        if (repository.existsUserByEmail(user.email())) {
            throw new UserAlreadyExistsException(ExceptionMessages.USER_EMAIL_ALREADY_USED);
        }
    }

    private User changePasswordValidation(UUID id, String newPassword) {
        Optional<User> userToSave = repository.findById(id);

        if (userToSave.isEmpty()) {
            throw new UserNotFoundException(ExceptionMessages.USER_NOT_FOUND);
        }

        User user = userToSave.get();

        if (user.getPassword().isBlank()) {
            throw new PasswordChangeException(ExceptionMessages.OLD_PASSWORD_EMPTY);
        }

        if (newPassword.isBlank()) {
            throw new PasswordChangeException(ExceptionMessages.NEW_PASSWORD_EMPTY);
        }


        if (encoder.matches(newPassword, user.getPassword())) {
            throw new PasswordChangeException(ExceptionMessages.OLD_PASSWORD_EQUALS_NEW);
        }


       userToSave.get().setPassword(encoder.encode(newPassword));

       return userToSave.get();
    }

}
