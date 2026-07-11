package com.incubyte.cardealership.service;

import com.incubyte.cardealership.dto.*;
import com.incubyte.cardealership.entity.User;
import com.incubyte.cardealership.entity.UserRole;
import com.incubyte.cardealership.exception.DuplicateEmailException;
import com.incubyte.cardealership.exception.InvalidCredentialsException;
import com.incubyte.cardealership.mapper.UserMapper;
import com.incubyte.cardealership.repository.UserRepository;
import com.incubyte.cardealership.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private UserMapper userMapper;

    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthServiceImpl authService;

    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;
    private User user;
    private UserResponse userResponse;

    @BeforeEach
    void setUp() {
        registerRequest = RegisterRequest.builder()
                .name("John Doe")
                .email("john@example.com")
                .password("Password123!")
                .build();

        loginRequest = LoginRequest.builder()
                .email("john@example.com")
                .password("Password123!")
                .build();

        user = User.builder()
                .id(UUID.randomUUID())
                .name("John Doe")
                .email("john@example.com")
                .password("hashed_password")
                .role(UserRole.ROLE_USER)
                .build();

        userResponse = UserResponse.builder()
                .id(user.getId())
                .name("John Doe")
                .email("john@example.com")
                .role(UserRole.ROLE_USER)
                .build();
    }

    @Test
    void shouldRegisterUserSuccessfully() {
        // Arrange
        when(userRepository.existsByEmail(registerRequest.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(registerRequest.getPassword())).thenReturn("hashed_password");
        when(userMapper.toEntity(registerRequest)).thenReturn(user);
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(userMapper.toResponse(any(User.class))).thenReturn(userResponse);
        when(jwtTokenProvider.generateToken(anyString(), anyString())).thenReturn("jwt_token");

        // Act
        RegisterResponse response = authService.register(registerRequest);

        // Assert
        assertThat(response).isNotNull();
        assertThat(response.getToken()).isEqualTo("jwt_token");
        assertThat(response.getUser().getEmail()).isEqualTo("john@example.com");
        verify(userRepository).save(any(User.class));
    }

    @Test
    void shouldRegisterAdminSuccessfully() {
        // Arrange
        User adminUser = User.builder()
                .id(UUID.randomUUID())
                .name("Admin User")
                .email("admin@example.com")
                .password("hashed_password")
                .role(UserRole.ROLE_ADMIN)
                .build();
        UserResponse adminResponse = UserResponse.builder()
                .id(adminUser.getId())
                .name("Admin User")
                .email("admin@example.com")
                .role(UserRole.ROLE_ADMIN)
                .build();
        RegisterRequest adminRequest = RegisterRequest.builder()
                .name("Admin User")
                .email("admin@example.com")
                .password("Password123!")
                .build();

        when(userRepository.existsByEmail(adminRequest.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(adminRequest.getPassword())).thenReturn("hashed_password");
        when(userMapper.toEntity(adminRequest)).thenReturn(adminUser);
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(userMapper.toResponse(any(User.class))).thenReturn(adminResponse);
        when(jwtTokenProvider.generateToken(anyString(), anyString())).thenReturn("jwt_token");

        // Act
        RegisterResponse response = authService.registerAdmin(adminRequest);

        // Assert
        assertThat(response).isNotNull();
        assertThat(response.getToken()).isEqualTo("jwt_token");
        assertThat(response.getUser().getRole()).isEqualTo(UserRole.ROLE_ADMIN);
        verify(userRepository).save(any(User.class));
    }

    @Test
    void shouldThrowExceptionWhenRegisteringWithDuplicateEmail() {
        // Arrange
        when(userRepository.existsByEmail(registerRequest.getEmail())).thenReturn(true);

        // Act & Assert
        assertThatThrownBy(() -> authService.register(registerRequest))
                .isInstanceOf(DuplicateEmailException.class)
                .hasMessageContaining("Email is already registered");

        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void shouldLoginSuccessfully() {
        // Arrange
        Authentication authentication = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(userRepository.findByEmail(loginRequest.getEmail())).thenReturn(Optional.of(user));
        when(userMapper.toResponse(user)).thenReturn(userResponse);
        when(jwtTokenProvider.generateToken(user.getEmail(), user.getRole().name())).thenReturn("jwt_token");

        // Act
        LoginResponse response = authService.login(loginRequest);

        // Assert
        assertThat(response).isNotNull();
        assertThat(response.getToken()).isEqualTo("jwt_token");
        assertThat(response.getUser().getEmail()).isEqualTo("john@example.com");
    }

    @Test
    void shouldThrowExceptionOnLoginWithBadCredentials() {
        // Arrange
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        // Act & Assert
        assertThatThrownBy(() -> authService.login(loginRequest))
                .isInstanceOf(InvalidCredentialsException.class)
                .hasMessageContaining("Invalid email or password");
    }
}
