package com.importadora.mb.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class WebSocketPublisher {

    private static final Logger log = LoggerFactory.getLogger(WebSocketPublisher.class);

    private final SimpMessagingTemplate template;

    public WebSocketPublisher(SimpMessagingTemplate template) {
        this.template = template;
    }

    public void publish(String type, Long entityId) {
        Map<String, Object> payload = Map.of(
            "type", type,
            "entityId", entityId != null ? entityId : 0
        );
        template.convertAndSend("/topic/events", payload);
        log.debug("WebSocket published: {} id={}", type, entityId);
    }

    public void publish(String type) {
        publish(type, null);
    }
}
