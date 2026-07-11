package com.incubyte.cardealership.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.incubyte.cardealership.dto.*;
import com.incubyte.cardealership.entity.UserRole;
import com.incubyte.cardealership.service.AuthService;
import com.incubyte.cardealership.service.CustomUserDetailsService;
import com.incubyte.cardealership.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = AuthController.class, excludeAutoConfiguration = SecurityAutoConfiguration.class)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    private RegisterRequest validRegisterRequest;
    private LoginRequest validLoginRequest;
    private RegisterResponse registerResponse;
    private LoginResponse loginResponse;

    @BeforeEach
    void setUp() {
        validRegisterRequest = RegisterRequest.builder()
                .name("John Doe")
                .email("john.doe@example.com")
                .password("Password123!")
                .build();

        validLoginRequest = LoginRequest.builder()
                .email("john.doe@example.com")
                .password("Password123!")
                .build();

        UserResponse userResponse = UserResponse.builder()
                .id(UUID.randomUUID())
                .name("John Doe")
                .email("john.doe@example.com")
                .role(UserRole.ROLE_USER)
                .build();

        registerResponse = RegisterResponse.builder()
                .user(userResponse)
                .token("jwt_register_token")
                .build();

        loginResponse = LoginResponse.builder()
                .user(userResponse)
                .token("jwt_login_token")
                .build();
    }

    @Test
    void shouldRegisterUserSuccessfullyAndReturn201() throws Exception {
        // Arrange
        when(authService.register(any(RegisterRequest.class))).thenReturn(registerResponse);

        // Act & Assert
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRegisterRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("User registered successfully"))
                .andExpect(jsonPath("$.data.token").value("jwt_register_token"))
                .andExpect(jsonPath("$.data.user.email").value("john.doe@example.com"));
    }

    @Test
    void shouldRegisterAdminSuccessfullyAndReturn201() throws Exception {
        // Arrange
        UserResponse adminResponse = UserResponse.builder()
                .id(UUID.randomUUID())
                .name("Admin User")
                .email("admin@example.com")
                .role(UserRole.ROLE_ADMIN)
                .build();
        RegisterResponse adminRegResponse = RegisterResponse.builder()
                .user(adminResponse)
                .token("jwt_admin_register_token")
                .build();

        when(authService.registerAdmin(any(RegisterRequest.class))).thenReturn(adminRegResponse);

        // Act & Assert
        mockMvc.perform(post("/api/auth/register-admin")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRegisterRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Admin registered successfully"))
                .andExpect(jsonPath("$.data.token").value("jwt_admin_register_token"))
                .andExpect(jsonPath("$.data.user.role").value("ROLE_ADMIN"));
    }

    @Test
    void shouldReturn400BadRequestWhenRegistrationInputIsInvalid() throws Exception {
        // Arrange
        RegisterRequest invalidRequest = RegisterRequest.builder()
                .name("") // Blank
                .email("invalid-email") // Bad format
                .password("short") // Short password
                .build();

        // Act & Assert
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Validation failed"));
    }

    @Test
    void shouldLoginSuccessfullyAndReturn200() throws Exception {
        // Arrange
        when(authService.login(any(LoginRequest.class))).thenReturn(loginResponse);

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validLoginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Login successful"))
                .andExpect(jsonPath("$.data.token").value("jwt_login_token"))
                .andExpect(jsonPath("$.data.user.email").value("john.doe@example.com"));
    }

    @Test
    void shouldReturn400BadRequestWhenLoginInputIsInvalid() throws Exception {
        // Arrange
        LoginRequest invalidRequest = LoginRequest.builder()
                .email("notanemail")
                .password("")
                .build();

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Validation failed"));
    }
}
