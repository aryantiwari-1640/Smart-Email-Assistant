package com.email.email_writer.com.email.writer.app.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.lang.reflect.Method;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.web.reactive.function.client.WebClient;

class EmailGeneratorServiceTest {

    private EmailGeneratorService service;

    @BeforeEach
    void setUp() {
        service = new EmailGeneratorService(WebClient.builder());
    }

    @Test
    void extractResponseContentReturnsGeminiText() throws Exception {
        Method extractResponseContent = EmailGeneratorService.class.getDeclaredMethod("extractResponseContent", String.class);
        extractResponseContent.setAccessible(true);

        String reply = (String) extractResponseContent.invoke(service,
                "{\"candidates\":[{\"content\":{\"parts\":[{\"text\":\"Hello from Gemini\"}]}}]}");

        assertEquals("Hello from Gemini", reply);
        assertTrue(reply.contains("Gemini"));
    }
}
