package com.gym.suscripciones.config;

import com.gym.suscripciones.model.Plan;
import com.gym.suscripciones.repository.PlanRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.math.BigDecimal;

@Configuration
public class DataLoader {

    @Bean
    public CommandLineRunner initPlanes(PlanRepository repo) {
        return args -> {
            if (repo.count() == 0) {
                Plan basico = new Plan();
                basico.setNombre("Básico");
                basico.setPrecio(new BigDecimal("9990"));
                basico.setDuracionDias(30);
                basico.setDescripcion("Acceso ilimitado al gimnasio en horario normal");
                repo.save(basico);

                Plan premium = new Plan();
                premium.setNombre("Premium");
                premium.setPrecio(new BigDecimal("19990"));
                premium.setDuracionDias(30);
                premium.setDescripcion("Incluye clases grupales y plan nutricional");
                repo.save(premium);

                Plan elite = new Plan();
                elite.setNombre("Elite");
                elite.setPrecio(new BigDecimal("29990"));
                elite.setDuracionDias(30);
                elite.setDescripcion("Acceso total 24/7, sauna, zona spa e invitados gratis");
                repo.save(elite);
            }
        };
    }
}
