package com.gym.pagos.controller;

import com.gym.pagos.model.Pago;
import com.gym.pagos.service.PagoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pagos")
public class PagoController {
    private final PagoService service;

    public PagoController(PagoService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Pago>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pago> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.obtenerPorId(id));
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Pago>> listarPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(service.listarPorUsuario(usuarioId));
    }

    @PostMapping
    public ResponseEntity<Pago> crear(@Valid @RequestBody Pago pago) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.crear(pago));
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<Pago> actualizarEstado(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(service.actualizarEstado(id, body.get("estado")));
    }

    @PostMapping("/pagar")
    public ResponseEntity<?> pagar(@RequestBody Map<String, Object> body) {
        try {
            Long usuarioId = ((Number) body.get("usuarioId")).longValue();
            Long planId = ((Number) body.get("planId")).longValue();
            String metodoPago = (String) body.getOrDefault("metodoPago", "tarjeta");
            Map<String, Object> result = service.pagarYCrearSuscripcion(usuarioId, planId, metodoPago);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
