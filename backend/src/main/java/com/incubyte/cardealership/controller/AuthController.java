package com.incubyte.cardealership.controller;

import com.incubyte.cardealership.dto.ApiResponse;
import com.incubyte.cardealership.dto.LoginRequest;
import com.incubyte.cardealership.dto.LoginResponse;
import com.incubyte.cardealership.dto.RegisterRequest;
import com.incubyte.cardealership.dto.RegisterResponse;
import com.incubyte.cardealership.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<RegisterResponse>> register(@Valid @RequestBody RegisterRequest request) {
        RegisterResponse response = authService.register(request);
        return new ResponseEntity<>(ApiResponse.success("User registered successfully", response), HttpStatus.CREATED);
    }

    @PostMapping("/register-admin")
    public ResponseEntity<ApiResponse<RegisterResponse>> registerAdmin(@Valid @RequestBody RegisterRequest request) {
        RegisterResponse response = authService.registerAdmin(request);
        return new ResponseEntity<>(ApiResponse.success("Admin registered successfully", response), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }
}
