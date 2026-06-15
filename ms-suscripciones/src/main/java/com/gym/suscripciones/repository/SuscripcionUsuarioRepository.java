package com.gym.suscripciones.repository;

import com.gym.suscripciones.model.SuscripcionUsuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SuscripcionUsuarioRepository extends JpaRepository<SuscripcionUsuario, Long> {
    List<SuscripcionUsuario> findByUsuarioId(Long usuarioId);
    List<SuscripcionUsuario> findByEstado(String estado);
}
