package com.email.email_writer.com.email.writer.app.Controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.email.email_writer.com.email.writer.app.service.GoogleAuthService;
import com.email.email_writer.com.email.writer.app.service.JwtService;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final GoogleAuthService googleAuthService;
    private final JwtService jwtService;

    public AuthController(GoogleAuthService googleAuthService, JwtService jwtService) {
        this.googleAuthService = googleAuthService;
        this.jwtService = jwtService;
    }

    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> body) {
        try {
            GoogleIdToken.Payload payload = googleAuthService.verify(body.get("token"));
            String jwt = jwtService.generateToken(payload.getEmail());
            return ResponseEntity.ok(Map.of("jwt", jwt, "email", payload.getEmail()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Google token");
        }
    }
}
