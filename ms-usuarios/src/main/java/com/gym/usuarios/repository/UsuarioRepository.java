package com.gym.usuarios.repository;

import com.gym.usuarios.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    List<Usuario> findByEstado(String estado);
    boolean existsByEmail(String email);
}
