package com.gym.gateway.service;

import com.gym.gateway.model.Asistencia;
import com.gym.gateway.repository.AsistenciaRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class AsistenciaService {
    private final AsistenciaRepository repository;

    public AsistenciaService(AsistenciaRepository repository) {
        this.repository = repository;
    }

    public List<Asistencia> listarTodas() {
        return repository.findAll();
    }

    public Asistencia obtenerPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asistencia no encontrada con id: " + id));
    }

    public List<Asistencia> listarPorUsuario(Long usuarioId) {
        return repository.findByUsuarioId(usuarioId);
    }

    public List<Asistencia> listarPorFecha(LocalDate fecha) {
        return repository.findByFecha(fecha);
    }

    public Asistencia registrarEntrada(Long usuarioId) {
        LocalDate hoy = LocalDate.now();
        List<Asistencia> existentes = repository.findByUsuarioIdAndFecha(usuarioId, hoy);
        if (!existentes.isEmpty()) {
            throw new RuntimeException("El usuario ya tiene un registro de entrada hoy");
        }
        Asistencia a = new Asistencia();
        a.setUsuarioId(usuarioId);
        a.setFecha(hoy);
        a.setHoraEntrada(LocalTime.now());
        return repository.save(a);
    }

    public Asistencia registrarSalida(Long usuarioId) {
        LocalDate hoy = LocalDate.now();
        List<Asistencia> existentes = repository.findByUsuarioIdAndFecha(usuarioId, hoy);
        if (existentes.isEmpty()) {
            throw new RuntimeException("No hay registro de entrada para hoy");
        }
        Asistencia a = existentes.get(0);
        if (a.getHoraSalida() != null) {
            throw new RuntimeException("El usuario ya registro salida hoy");
        }
        a.setHoraSalida(LocalTime.now());
        return repository.save(a);
    }
}