package com.gym.gateway.config;

import com.gym.gateway.model.Usuario;
import com.gym.gateway.repository.UsuarioRepository;
import com.gym.gateway.service.UsuarioService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataLoader {

    @Bean
    public CommandLineRunner initData(UsuarioRepository repo) {
        return args -> {
            if (!repo.existsByEmail("admin@gymweb.cl")) {
                Usuario dueno = new Usuario();
                dueno.setNombre("Admin");
                dueno.setApellido("GymWeb");
                dueno.setEmail("admin@gymweb.cl");
                dueno.setPassword(UsuarioService.hash("admin123"));
                dueno.setRol("DUENO");
                dueno.setEstado("activo");
                repo.save(dueno);
            }
            if (!repo.existsByEmail("maria@correo.cl")) {
                Usuario demo = new Usuario();
                demo.setNombre("Maria");
                demo.setApellido("Lopez");
                demo.setEmail("maria@correo.cl");
                demo.setPassword(UsuarioService.hash("demo1234"));
                demo.setRut("12.345.678-9");
                demo.setTelefono("+56 9 1234 5678");
                demo.setRol("MIEMBRO");
                demo.setEstado("activo");
                repo.save(demo);
            }
        };
    }
}
