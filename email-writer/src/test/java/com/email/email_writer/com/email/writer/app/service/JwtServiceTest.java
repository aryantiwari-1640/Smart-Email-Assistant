package com.email.email_writer.com.email.writer.app.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

class JwtServiceTest {

    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        ReflectionTestUtils.setField(jwtService, "secretKey", "test-secret-key-for-jwt-service-12345");
    }

    @Test
    void generateTokenRoundTripsEmail() {
        String token = jwtService.generateToken("user@example.com");

        assertTrue(jwtService.isValid(token));
        assertEquals("user@example.com", jwtService.extractEmail(token));
    }

    @Test
    void invalidTokenIsRejected() {
        assertFalse(jwtService.isValid("not-a-valid-token"));
    }
}
