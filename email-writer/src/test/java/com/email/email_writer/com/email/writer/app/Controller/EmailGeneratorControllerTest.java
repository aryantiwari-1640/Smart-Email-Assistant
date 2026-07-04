package com.email.email_writer.com.email.writer.app.Controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import com.email.email_writer.com.email.writer.app.dto.EmailRequest;
import com.email.email_writer.com.email.writer.app.service.EmailGeneratorService;
import com.email.email_writer.com.email.writer.app.service.RateLimiterService;

class EmailGeneratorControllerTest {

    private EmailGeneratorController controller;
    private EmailGeneratorService emailGeneratorService;
    private RateLimiterService rateLimiterService;

    @BeforeEach
    void setUp() {
        emailGeneratorService = mock(EmailGeneratorService.class);
        rateLimiterService = mock(RateLimiterService.class);
        controller = new EmailGeneratorController(emailGeneratorService, rateLimiterService);
    }

    @Test
    void generateEmailReturnsOkWhenRateLimitAllows() {
        EmailRequest request = new EmailRequest();
        request.setEmailContent("Hello");
        request.setTone("friendly");
        Authentication authentication = new UsernamePasswordAuthenticationToken("user", null);
        when(rateLimiterService.tryConsume("user")).thenReturn(true);
        when(emailGeneratorService.generateEmailReply(request)).thenReturn("Generated reply");

        ResponseEntity<String> response = controller.generateEmail(request, authentication);

        assertEquals(200, response.getStatusCode().value());
        assertEquals("Generated reply", response.getBody());
        verify(rateLimiterService).tryConsume("user");
        verify(emailGeneratorService).generateEmailReply(request);
    }

    @Test
    void generateEmailReturnsTooManyRequestsWhenRateLimitIsExceeded() {
        EmailRequest request = new EmailRequest();
        request.setEmailContent("Hello");
        request.setTone("friendly");
        Authentication authentication = new UsernamePasswordAuthenticationToken("user", null);
        when(rateLimiterService.tryConsume("user")).thenReturn(false);

        ResponseEntity<String> response = controller.generateEmail(request, authentication);

        assertEquals(429, response.getStatusCode().value());
        assertEquals("Too Many Requests.Please wait a moment and try again.", response.getBody());
        verify(rateLimiterService).tryConsume("user");
        verifyNoInteractions(emailGeneratorService);
    }
}
