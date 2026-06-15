package com.gym.gateway.config;

import com.gym.gateway.model.Plan;
import com.gym.gateway.model.Usuario;
import com.gym.gateway.repository.PlanRepository;
import com.gym.gateway.repository.UsuarioRepository;
import com.gym.gateway.service.UsuarioService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.math.BigDecimal;

@Configuration
public class DataLoader {

    @Bean
    public CommandLineRunner initData(UsuarioRepository usuarioRepo, PlanRepository planRepo) {
        return args -> {
            if (!usuarioRepo.existsByEmail("admin@gymweb.cl")) {
                Usuario dueno = new Usuario();
                dueno.setNombre("Admin");
                dueno.setApellido("GymWeb");
                dueno.setEmail("admin@gymweb.cl");
                dueno.setPassword(UsuarioService.hash("admin123"));
                dueno.setRol("DUENO");
                dueno.setEstado("activo");
                usuarioRepo.save(dueno);
            }
            if (!usuarioRepo.existsByEmail("maria@correo.cl")) {
                Usuario demo = new Usuario();
                demo.setNombre("Maria");
                demo.setApellido("Lopez");
                demo.setEmail("maria@correo.cl");
                demo.setPassword(UsuarioService.hash("demo1234"));
                demo.setRut("12.345.678-9");
                demo.setTelefono("+56 9 1234 5678");
                demo.setRol("MIEMBRO");
                demo.setEstado("activo");
                usuarioRepo.save(demo);
            }
            if (planRepo.count() == 0) {
                Plan basico = new Plan();
                basico.setNombre("Basico");
                basico.setPrecio(new BigDecimal("9990"));
                basico.setDuracionDias(30);
                basico.setDescripcion("Acceso ilimitado al gimnasio en horario normal");
                planRepo.save(basico);

                Plan premium = new Plan();
                premium.setNombre("Premium");
                premium.setPrecio(new BigDecimal("19990"));
                premium.setDuracionDias(30);
                premium.setDescripcion("Incluye clases grupales y plan nutricional");
                planRepo.save(premium);

                Plan elite = new Plan();
                elite.setNombre("Elite");
                elite.setPrecio(new BigDecimal("29990"));
                elite.setDuracionDias(30);
                elite.setDescripcion("Acceso total 24/7, sauna, zona spa e invitados gratis");
                planRepo.save(elite);
            }
        };
    }
}