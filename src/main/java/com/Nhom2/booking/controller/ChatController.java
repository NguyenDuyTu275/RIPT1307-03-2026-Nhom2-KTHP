package com.Nhom2.booking.controller;

import com.Nhom2.booking.entity.AppConfig;
import com.Nhom2.booking.repository.AppConfigRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
public class ChatController {

    @Autowired
    private AppConfigRepository configRepository;

    @PostMapping
    @SuppressWarnings("unchecked")
    public ResponseEntity<?> chatWithAI(@RequestBody ChatRequest request) {
        try {
            AppConfig apiKeyConfig = configRepository.findById("OPENAI_API_KEY")
                    .orElseThrow(() -> new RuntimeException("OPENAI_API_KEY not found"));
            String openAiApiKey = apiKeyConfig.getConfigValue();

            String systemPrompt = String.format(
                    "Bạn là trợ lý AI của khách sạn \"%s\" tại %s. Trả lời ngắn gọn, thân thiện bằng tiếng Việt. Thông tin khách sạn: %s. Rating: %s/10.",
                    request.getHotelInfo().get("name"), request.getHotelInfo().get("city"),
                    request.getHotelInfo().get("description"), request.getHotelInfo().get("ratingAvg"));

            List<Map<String, String>> openAiMessages = new ArrayList<>();
            Map<String, String> systemMessage = new HashMap<>();
            systemMessage.put("role", "system");
            systemMessage.put("content", systemPrompt);

            openAiMessages.add(systemMessage);
            openAiMessages.addAll(request.getMessages());

            Map<String, Object> openAiRequestBody = new HashMap<>();
            openAiRequestBody.put("model", "gpt-3.5-turbo");
            openAiRequestBody.put("messages", openAiMessages);
            openAiRequestBody.put("max_tokens", 500);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(openAiApiKey);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(openAiRequestBody, headers);
            RestTemplate restTemplate = new RestTemplate();

            @SuppressWarnings("rawtypes")
            ResponseEntity<Map> response = restTemplate.postForEntity(
                    "https://api.openai.com/v1/chat/completions", entity, Map.class);

            Map<String, Object> responseBody = response.getBody();
            List<Map<String, Object>> choices = (List<Map<String, Object>>) responseBody.get("choices");
            Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");

            Map<String, String> result = new HashMap<>();
            result.put("reply", (String) message.get("content"));

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("reply", "Lỗi kết nối từ Backend tới AI."));
        }
    }

    public static class ChatRequest {
        private List<Map<String, String>> messages;
        private Map<String, Object> hotelInfo;

        public List<Map<String, String>> getMessages() {
            return messages;
        }

        public void setMessages(List<Map<String, String>> messages) {
            this.messages = messages;
        }

        public Map<String, Object> getHotelInfo() {
            return hotelInfo;
        }

        public void setHotelInfo(Map<String, Object> hotelInfo) {
            this.hotelInfo = hotelInfo;
        }
    }
}