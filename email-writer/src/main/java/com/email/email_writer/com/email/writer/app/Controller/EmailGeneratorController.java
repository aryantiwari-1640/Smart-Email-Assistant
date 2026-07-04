package com.email.email_writer.com.email.writer.app.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.email.email_writer.com.email.writer.app.dto.EmailRequest;
import com.email.email_writer.com.email.writer.app.service.EmailGeneratorService;
import com.email.email_writer.com.email.writer.app.service.RateLimiterService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/email")
@AllArgsConstructor
@CrossOrigin(origins="*")
public class EmailGeneratorController {

    private final EmailGeneratorService emailGeneratorService;
    private final RateLimiterService rateLimiterService;

    @PostMapping("/generate")
    public ResponseEntity<String> generateEmail(@RequestBody EmailRequest emailRequest,Authentication authentication) {
        String userKey = authentication.getName();
        if (!rateLimiterService.tryConsume(userKey)) {
            return ResponseEntity.status(429).body("Too Many Requests.Please wait a moment and try again.");
        }
        String response=emailGeneratorService.generateEmailReply(emailRequest);
        return ResponseEntity.ok(response);
    }
}