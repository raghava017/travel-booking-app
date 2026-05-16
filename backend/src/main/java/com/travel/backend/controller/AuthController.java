package com.travel.backend.controller;

import com.travel.backend.dto.AuthResponse;
import com.travel.backend.dto.LoginRequest;
import com.travel.backend.dto.RegisterRequest;

import com.travel.backend.service.AuthService;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    private final AuthService authService;

    // CONSTRUCTOR INJECTION

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public AuthResponse register(
            @RequestBody RegisterRequest request
    ) {

        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(
            @RequestBody LoginRequest request
    ) {

        return authService.login(request);
    }
}