package com.incubyte.cardealership.service;

import com.incubyte.cardealership.dto.*;
import com.incubyte.cardealership.entity.User;
import com.incubyte.cardealership.entity.UserRole;
import com.incubyte.cardealership.exception.DuplicateEmailException;
import com.incubyte.cardealership.exception.InvalidCredentialsException;
import com.incubyte.cardealership.exception.UserNotFoundException;
import com.incubyte.cardealership.mapper.UserMapper;
import com.incubyte.cardealership.repository.UserRepository;
import com.incubyte.cardealership.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserMapper userMapper;
    private final AuthenticationManager authenticationManager;

    public AuthServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           JwtTokenProvider jwtTokenProvider,
                           UserMapper userMapper,
                           AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userMapper = userMapper;
        this.authenticationManager = authenticationManager;
    }

    @Override
    @Transactional
    public RegisterResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException("Email is already registered");
        }

        User user = userMapper.toEntity(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(UserRole.ROLE_USER); // Default signup is ROLE_USER

        User savedUser = userRepository.save(user);
        UserResponse userResponse = userMapper.toResponse(savedUser);
        String token = jwtTokenProvider.generateToken(savedUser.getEmail(), savedUser.getRole().name());

        return RegisterResponse.builder()
                .user(userResponse)
                .token(token)
                .build();
    }

    @Override
    @Transactional
    public RegisterResponse registerAdmin(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException("Email is already registered");
        }

        User user = userMapper.toEntity(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(UserRole.ROLE_ADMIN); // Admin signup is ROLE_ADMIN

        User savedUser = userRepository.save(user);
        UserResponse userResponse = userMapper.toResponse(savedUser);
        String token = jwtTokenProvider.generateToken(savedUser.getEmail(), savedUser.getRole().name());

        return RegisterResponse.builder()
                .user(userResponse)
                .token(token)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (BadCredentialsException ex) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + request.getEmail()));

        UserResponse userResponse = userMapper.toResponse(user);
        String token = jwtTokenProvider.generateToken(user.getEmail(), user.getRole().name());

        return LoginResponse.builder()
                .user(userResponse)
                .token(token)
                .build();
    }
}
