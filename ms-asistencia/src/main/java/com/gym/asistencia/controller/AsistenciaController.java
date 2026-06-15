package com.gym.asistencia.controller;

import com.gym.asistencia.model.Asistencia;
import com.gym.asistencia.service.AsistenciaService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/asistencia")
public class AsistenciaController {
    private final AsistenciaService service;

    public AsistenciaController(AsistenciaService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Asistencia>> listarTodas() {
        return ResponseEntity.ok(service.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Asistencia> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.obtenerPorId(id));
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Asistencia>> listarPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(service.listarPorUsuario(usuarioId));
    }

    @GetMapping("/fecha")
    public ResponseEntity<List<Asistencia>> listarPorFecha(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        return ResponseEntity.ok(service.listarPorFecha(fecha));
    }

    @PostMapping("/entrada/{usuarioId}")
    public ResponseEntity<Asistencia> registrarEntrada(@PathVariable Long usuarioId) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.registrarEntrada(usuarioId));
    }

    @PutMapping("/salida/{usuarioId}")
    public ResponseEntity<Asistencia> registrarSalida(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(service.registrarSalida(usuarioId));
    }
}
