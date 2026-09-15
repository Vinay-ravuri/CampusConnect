package com.campusconnect.service;

import com.campusconnect.dto.AuthDtos.*;
import com.campusconnect.entity.User;
import com.campusconnect.repository.UserRepository;
import com.campusconnect.security.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email address already registered");
        }

        boolean isAdmin = "admin@campusconnect.com".equalsIgnoreCase(req.getEmail().trim());
        String role = isAdmin ? "ADMIN" : "STUDENT";

        User user = new User(
                req.getName(),
                req.getEmail().trim().toLowerCase(),
                passwordEncoder.encode(req.getPassword()),
                role
        );

        userRepository.save(user);

        String token = tokenProvider.generateToken(user.getEmail(), user.getRole());
        return new AuthResponse(token, user.getName(), user.getEmail(), user.getRole());
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = tokenProvider.generateToken(user.getEmail(), user.getRole());
        return new AuthResponse(token, user.getName(), user.getEmail(), user.getRole());
    }
}
