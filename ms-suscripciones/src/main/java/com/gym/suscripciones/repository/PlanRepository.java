package com.gym.suscripciones.repository;

import com.gym.suscripciones.model.Plan;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlanRepository extends JpaRepository<Plan, Long> {
}
