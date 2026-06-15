package com.gym.gateway.service;

import com.gym.gateway.model.Plan;
import com.gym.gateway.model.SuscripcionUsuario;
import com.gym.gateway.repository.PlanRepository;
import com.gym.gateway.repository.SuscripcionUsuarioRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class SuscripcionService {
    private final PlanRepository planRepository;
    private final SuscripcionUsuarioRepository suscripcionRepository;

    public SuscripcionService(PlanRepository planRepository,
                               SuscripcionUsuarioRepository suscripcionRepository) {
        this.planRepository = planRepository;
        this.suscripcionRepository = suscripcionRepository;
    }

    public List<Plan> listarPlanes() {
        return planRepository.findAll();
    }

    public Plan crearPlan(Plan plan) {
        return planRepository.save(plan);
    }

    public Plan obtenerPlan(Long id) {
        return planRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plan no encontrado con id: " + id));
    }

    public List<SuscripcionUsuario> listarSuscripciones() {
        return suscripcionRepository.findAll();
    }

    public List<SuscripcionUsuario> listarPorUsuario(Long usuarioId) {
        return suscripcionRepository.findByUsuarioId(usuarioId);
    }

    public SuscripcionUsuario asignarSuscripcion(Long usuarioId, Long planId) {
        Plan plan = obtenerPlan(planId);
        SuscripcionUsuario s = new SuscripcionUsuario();
        s.setUsuarioId(usuarioId);
        s.setPlanId(planId);
        s.setFechaInicio(LocalDate.now());
        s.setFechaFin(LocalDate.now().plusDays(plan.getDuracionDias()));
        s.setEstado("activa");
        return suscripcionRepository.save(s);
    }

    public SuscripcionUsuario obtenerSuscripcion(Long id) {
        return suscripcionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Suscripcion no encontrada con id: " + id));
    }

    public SuscripcionUsuario obtenerSuscripcionActivaPorUsuario(Long usuarioId) {
        List<SuscripcionUsuario> suscripciones = suscripcionRepository.findByUsuarioId(usuarioId);
        return suscripciones.stream()
                .filter(s -> "activa".equals(s.getEstado()))
                .findFirst()
                .orElse(null);
    }

    public void cancelarSuscripcion(Long id) {
        SuscripcionUsuario s = obtenerSuscripcion(id);
        s.setEstado("cancelada");
        suscripcionRepository.save(s);
    }
}