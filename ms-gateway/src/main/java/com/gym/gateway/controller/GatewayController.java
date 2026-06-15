package com.gym.gateway.controller;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import jakarta.servlet.http.HttpServletRequest;
import java.net.URI;

@RestController
public class GatewayController {
    private final RestTemplate restTemplate;
    private final String asistencia;
    private final String suscripciones;
    private final String pagos;

    public GatewayController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
        this.asistencia = env("URL_ASISTENCIA", "http://localhost:8082");
        this.suscripciones = env("URL_SUSCRIPCIONES", "http://localhost:8083");
        this.pagos = env("URL_PAGOS", "http://localhost:8084");
    }

    private String env(String key, String def) {
        String val = System.getenv(key);
        return val != null ? val : def;
    }

    @RequestMapping("/api/asistencia/**")
    public ResponseEntity<byte[]> proxyAsistencia(HttpServletRequest request) {
        return proxy(asistencia, request);
    }

    @RequestMapping("/api/suscripciones/**")
    public ResponseEntity<byte[]> proxySuscripciones(HttpServletRequest request) {
        return proxy(suscripciones, request);
    }

    @RequestMapping("/api/pagos/**")
    public ResponseEntity<byte[]> proxyPagos(HttpServletRequest request) {
        return proxy(pagos, request);
    }

    private ResponseEntity<byte[]> proxy(String baseUrl, HttpServletRequest request) {
        try {
            String uri = request.getRequestURI();
            String query = request.getQueryString();
            String url = baseUrl + uri + (query != null ? "?" + query : "");

            HttpMethod method = HttpMethod.valueOf(request.getMethod());
            byte[] body = request.getInputStream().readAllBytes();
            HttpHeaders fwdHeaders = new HttpHeaders();
            fwdHeaders.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<byte[]> entity = new HttpEntity<>(body, fwdHeaders);

            ResponseEntity<byte[]> response = restTemplate.exchange(
                    URI.create(url), method, entity, byte[].class);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            return new ResponseEntity<>(response.getBody(), headers, response.getStatusCode());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                    .body(("{\"error\":\"" + e.getMessage() + "\"}").getBytes());
        }
    }
}
