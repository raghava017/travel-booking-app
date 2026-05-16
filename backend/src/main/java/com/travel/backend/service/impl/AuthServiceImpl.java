package com.travel.backend.service.impl;

import com.travel.backend.dto.AuthResponse;
import com.travel.backend.dto.LoginRequest;
import com.travel.backend.dto.RegisterRequest;
import com.travel.backend.entity.User;
import com.travel.backend.repository.UserRepository;
import com.travel.backend.service.AuthService;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder;

    public AuthServiceImpl(
            UserRepository userRepository,
            BCryptPasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public AuthResponse register(RegisterRequest request) {

        String email = request.getEmail() != null ? request.getEmail().trim().toLowerCase() : "";
        String fullName = request.getFullName() != null && !request.getFullName().trim().isEmpty()
                ? request.getFullName().trim()
                : request.getName() != null ? request.getName().trim() : "";
        String password = request.getPassword() != null ? request.getPassword() : "";

        if (fullName.isEmpty() || email.isEmpty() || password.length() < 6) {
            return new AuthResponse(
                    "Please enter name, valid email, and minimum 6 character password",
                    null
            );
        }

        if (userRepository.findByEmail(email).isPresent()) {

            return new AuthResponse(
                    "Email Already Exists",
                    null
            );
        }

        User user = new User();

        user.setFullName(fullName);

        user.setEmail(email);

        user.setPassword(
                passwordEncoder.encode(password)
        );

        user.setRole("USER");

        user.setCreatedAt(LocalDateTime.now());

        userRepository.save(user);

        return new AuthResponse(
                "Registration Successful",
                null
        );
    }

    @Override
    public AuthResponse login(LoginRequest request) {

        String email = request.getEmail() != null ? request.getEmail().trim().toLowerCase() : "";
        String password = request.getPassword() != null ? request.getPassword() : "";

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            return new AuthResponse(
                    "No account found with this email",
                    null
            );
        }

        boolean passwordMatches = passwordEncoder.matches(
                password,
                user.getPassword()
        );

        if (!passwordMatches) {

            return new AuthResponse(
                    "Invalid email or password",
                    null
            );
        }

        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        return new AuthResponse(
                "Login Successful",
                "FAKE_JWT_TOKEN",
                user.getFullName(),
                user.getRole()
        );
    }
}
