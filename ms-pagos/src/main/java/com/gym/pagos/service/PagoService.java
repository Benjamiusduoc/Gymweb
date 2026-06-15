package com.gym.pagos.service;

import com.gym.pagos.model.Pago;
import com.gym.pagos.repository.PagoRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Value;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class PagoService {
    private final PagoRepository repository;
    private final RestTemplate restTemplate;

    @Value("${app.url-suscripciones:http://localhost:8083}")
    private String urlSuscripciones;

    public PagoService(PagoRepository repository, RestTemplate restTemplate) {
        this.repository = repository;
        this.restTemplate = restTemplate;
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

    @SuppressWarnings("unchecked")
    public Map<String, Object> pagarYCrearSuscripcion(Long usuarioId, Long planId, String metodoPago) {
        Map<String, Object> plan = restTemplate.getForObject(
                urlSuscripciones + "/api/suscripciones/planes/" + planId, Map.class);
        if (plan == null) throw new RuntimeException("Plan no encontrado");

        Object precioObj = plan.get("precio");
        BigDecimal monto = new BigDecimal(precioObj.toString());

        Pago pago = new Pago();
        pago.setUsuarioId(usuarioId);
        pago.setMonto(monto);
        pago.setMetodoPago(metodoPago);
        pago.setEstado("completado");
        pago.setFechaPago(LocalDateTime.now());
        pago = repository.save(pago);

        Map<String, Object> body = Map.of("usuarioId", usuarioId, "planId", planId);
        Map<String, Object> susc = restTemplate.postForObject(
                urlSuscripciones + "/api/suscripciones/asignar", body, Map.class);

        pago.setSuscripcionId(susc != null ? ((Number) susc.get("id")).longValue() : null);
        repository.save(pago);

        return Map.of(
                "pago", pago,
                "suscripcion", susc != null ? susc : Map.of(),
                "plan", plan
        );
    }
}
