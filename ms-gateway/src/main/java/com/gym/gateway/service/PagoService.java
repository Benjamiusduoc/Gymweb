package com.gym.gateway.service;

import com.gym.gateway.model.Pago;
import com.gym.gateway.model.Plan;
import com.gym.gateway.model.SuscripcionUsuario;
import com.gym.gateway.repository.PagoRepository;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.List;

@Service
public class PagoService {
    private final PagoRepository repository;
    private final SuscripcionService suscripcionService;

    public PagoService(PagoRepository repository, SuscripcionService suscripcionService) {
        this.repository = repository;
        this.suscripcionService = suscripcionService;
    }

    public List<Pago> listarTodos() {
        return repository.findAll();
    }

    public Pago obtenerPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pago no encontrado con id: " + id));
    }

    public List<Pago> listarPorUsuario(Long usuarioId) {
        return repository.findByUsuarioId(usuarioId);
    }

    public Pago crear(Pago pago) {
        return repository.save(pago);
    }

    public Pago actualizarEstado(Long id, String estado) {
        Pago pago = obtenerPorId(id);
        pago.setEstado(estado);
        return repository.save(pago);
    }

    public java.util.Map<String, Object> pagarYCrearSuscripcion(Long usuarioId, Long planId, String metodoPago) {
        Plan plan = suscripcionService.obtenerPlan(planId);

        Pago pago = new Pago();
        pago.setUsuarioId(usuarioId);
        pago.setMonto(plan.getPrecio());
        pago.setMetodoPago(metodoPago);
        pago.setEstado("completado");
        pago = repository.save(pago);

        SuscripcionUsuario suscripcion = suscripcionService.asignarSuscripcion(usuarioId, planId);
        pago.setSuscripcionId(suscripcion.getId());
        repository.save(pago);

        return java.util.Map.of(
                "pago", pago,
                "suscripcion", suscripcion,
                "plan", plan
        );
    }
}