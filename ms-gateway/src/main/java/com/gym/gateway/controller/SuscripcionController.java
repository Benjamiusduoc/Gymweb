package com.gym.gateway.controller;

import com.gym.gateway.model.Plan;
import com.gym.gateway.model.SuscripcionUsuario;
import com.gym.gateway.service.SuscripcionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/suscripciones")
public class SuscripcionController {
    private final SuscripcionService service;

    public SuscripcionController(SuscripcionService service) {
        this.service = service;
    }

    @GetMapping("/planes")
    public ResponseEntity<List<Plan>> listarPlanes() {
        return ResponseEntity.ok(service.listarPlanes());
    }

    @PostMapping("/planes")
    public ResponseEntity<Plan> crearPlan(@RequestBody Plan plan) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.crearPlan(plan));
    }

    @GetMapping("/planes/{id}")
    public ResponseEntity<Plan> obtenerPlan(@PathVariable Long id) {
        return ResponseEntity.ok(service.obtenerPlan(id));
    }

    @GetMapping
    public ResponseEntity<List<SuscripcionUsuario>> listarSuscripciones() {
        return ResponseEntity.ok(service.listarSuscripciones());
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<SuscripcionUsuario>> listarPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(service.listarPorUsuario(usuarioId));
    }

    @GetMapping("/usuario/{usuarioId}/activa")
    public ResponseEntity<SuscripcionUsuario> obtenerActiva(@PathVariable Long usuarioId) {
        SuscripcionUsuario s = service.obtenerSuscripcionActivaPorUsuario(usuarioId);
        if (s == null) return ResponseEntity.noContent().build();
        return ResponseEntity.ok(s);
    }

    @PostMapping("/asignar")
    public ResponseEntity<SuscripcionUsuario> asignar(@RequestBody Map<String, Long> body) {
        Long usuarioId = body.get("usuarioId");
        Long planId = body.get("planId");
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.asignarSuscripcion(usuarioId, planId));
    }

    @PutMapping("/{id}/cancelar")
    public ResponseEntity<Void> cancelar(@PathVariable Long id) {
        service.cancelarSuscripcion(id);
        return ResponseEntity.noContent().build();
    }
}