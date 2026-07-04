package com.email.email_writer.com.email.writer.app.Controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;

import com.email.email_writer.com.email.writer.app.service.GoogleAuthService;
import com.email.email_writer.com.email.writer.app.service.JwtService;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;

class AuthControllerTest {

    private AuthController authController;
    private GoogleAuthService googleAuthService;
    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        googleAuthService = mock(GoogleAuthService.class);
        jwtService = mock(JwtService.class);
        authController = new AuthController(googleAuthService, jwtService);
    }

    @Test
    void googleLoginReturnsJwtAndEmailWhenTokenIsValid() throws Exception {
        GoogleIdToken.Payload payload = new GoogleIdToken.Payload();
        payload.setEmail("user@example.com");
        when(googleAuthService.verify("valid-token")).thenReturn(payload);
        when(jwtService.generateToken("user@example.com")).thenReturn("jwt-token");

        ResponseEntity<?> response = authController.googleLogin(Map.of("token", "valid-token"));

        assertEquals(200, response.getStatusCode().value());
        assertEquals(Map.of("jwt", "jwt-token", "email", "user@example.com"), response.getBody());
    }

    @Test
    void googleLoginReturnsUnauthorizedWhenTokenIsInvalid() throws Exception {
        when(googleAuthService.verify("invalid-token")).thenThrow(new IllegalArgumentException("Invalid token"));

        ResponseEntity<?> response = authController.googleLogin(Map.of("token", "invalid-token"));

        assertEquals(401, response.getStatusCode().value());
        assertEquals("Invalid Google token", response.getBody());
    }
}
