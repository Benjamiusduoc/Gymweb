package com.gym.gateway.repository;

import com.gym.gateway.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    List<Usuario> findByEstado(String estado);
    boolean existsByEmail(String email);
    Optional<Usuario> findByEmail(String email);
}
