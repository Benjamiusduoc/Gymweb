package com.gym.gateway.repository;

import com.gym.gateway.model.Asistencia;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface AsistenciaRepository extends JpaRepository<Asistencia, Long> {
    List<Asistencia> findByUsuarioId(Long usuarioId);
    List<Asistencia> findByFecha(LocalDate fecha);
    List<Asistencia> findByUsuarioIdAndFecha(Long usuarioId, LocalDate fecha);
}