package com.travel.backend.service;

import com.travel.backend.dto.AuthResponse;
import com.travel.backend.dto.LoginRequest;
import com.travel.backend.dto.RegisterRequest;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}