package com.incubyte.cardealership.service;

import com.incubyte.cardealership.dto.LoginRequest;
import com.incubyte.cardealership.dto.LoginResponse;
import com.incubyte.cardealership.dto.RegisterRequest;
import com.incubyte.cardealership.dto.RegisterResponse;

public interface AuthService {
    RegisterResponse register(RegisterRequest request);
    RegisterResponse registerAdmin(RegisterRequest request);
    LoginResponse login(LoginRequest request);
}
