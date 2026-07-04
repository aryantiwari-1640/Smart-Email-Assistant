package com.email.email_writer.com.email.writer.app.service;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class RateLimiterServiceTest {

    private RateLimiterService rateLimiterService;

    @BeforeEach
    void setUp() {
        rateLimiterService = new RateLimiterService();
    }

    @Test
    void allowsTenRequestsPerUserBeforeBlocking() {
        for (int i = 0; i < 10; i++) {
            assertTrue(rateLimiterService.tryConsume("user1"));
        }

        assertFalse(rateLimiterService.tryConsume("user1"));
    }
}
