package com.email.email_writer.com.email.writer.app.service;

import java.time.Duration;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.email.email_writer.com.email.writer.app.dto.EmailRequest;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
@Service
public class EmailGeneratorService {

    private final WebClient webClient;

    @Value("${gemini.api.key}")
    private String geminiApiKey;
    
    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    public EmailGeneratorService(WebClient.Builder webClient){
        this.webClient=webClient.build();
    }

    public String generateEmailReply(EmailRequest emailRequest) {
        String prompt = buildPrompt(emailRequest);
        Map<String,Object>requestBody = Map.of(
            "contents", new Object[]{
                Map.of("parts", new Object[]{
                    Map.of("text",prompt)
                })
            }
        );

        String response=webClient.post()
                        .uri(geminiApiUrl)
                        .header("X-goog-api-key", geminiApiKey)
                        .header("Content-Type","application/json")
                        .bodyValue(requestBody)
                        .retrieve()
                        .bodyToMono(String.class)
                        .timeout(Duration.ofSeconds(10))
                        .block();
        
        return extractResponseContent(response);
    }

    private String extractResponseContent(String response){
        try{
            ObjectMapper mapper=new ObjectMapper();
            JsonNode rootNode=mapper.readTree(response);
            return rootNode.path("candidates")
                  .get(0)
                  .path("content")
                  .path("parts")
                  .get(0)
                  .path("text")
                  .asString();
            
        }catch(Exception e){
            return "Error Processing request: " + e.getMessage();
        }
    }

    private String buildPrompt(EmailRequest emailRequest) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("Generate a professional email reply to the following email content.Please Dont generate a subject line ");
        if(emailRequest.getTone()!=null && !emailRequest.getTone().isEmpty()){
            prompt.append("Use a ").append(emailRequest.getTone()).append(" tone.");
        }
        prompt.append("\nOriginal Email: \n").append(emailRequest.getEmailContent());
        return prompt.toString();
    }
}
