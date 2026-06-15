package com.gym.gateway.controller;

import org.springframework.web.bind.annotation.*;

@RestController
public class GatewayController {

    @GetMapping("/api/health")
    public java.util.Map<String, Object> health() {
        return java.util.Map.of(
            "status", "UP",
            "service", "gymweb-gateway",
            "version", "2.0.0"
        );
    }
}