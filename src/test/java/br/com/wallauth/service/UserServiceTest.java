package br.com.wallauth.service;

import br.com.wallauth.model.Role;
import br.com.wallauth.model.consts.ExceptionMessages;
import br.com.wallauth.model.dto.RegisterDto;
import br.com.wallauth.model.exception.UserAlreadyExistsException;
import br.com.wallauth.repository.UserRepository;
import br.com.wallauth.service.impl.UserServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.anyString;
import static org.mockito.Mockito.doReturn;


@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserServiceImpl userService;


    @Test
    void givenExistentEmailShouldThrowUserAlreadyExistsException() {
        doReturn(true).when(userRepository).existsUserByEmail(anyString());

        RegisterDto dto = generatedUser();


        UserAlreadyExistsException exception = assertThrows(UserAlreadyExistsException.class,
                () -> userService.createUser(dto));

        assertEquals(ExceptionMessages.USER_EMAIL_ALREADY_USED, exception.getMessage(),
                "A exceção lançada não é a de E-mail já utilizado!");
    }




    private RegisterDto generatedUser() {
        return RegisterDto.builder().email("user123")
                .password("senha123")
                .email("emailTest@test.com")
                .role(Role.CLI)
                .build();
    }


}
