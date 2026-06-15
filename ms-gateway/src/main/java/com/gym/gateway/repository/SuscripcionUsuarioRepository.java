package com.gym.gateway.repository;

import com.gym.gateway.model.SuscripcionUsuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SuscripcionUsuarioRepository extends JpaRepository<SuscripcionUsuario, Long> {
    List<SuscripcionUsuario> findByUsuarioId(Long usuarioId);
    List<SuscripcionUsuario> findByEstado(String estado);
}