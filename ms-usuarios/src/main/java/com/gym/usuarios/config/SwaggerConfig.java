package com.gym.usuarios.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {
    @Bean
    public OpenAPI gymUsuariosOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("MS-Usuarios")
                        .description("API de gestión de usuarios del gimnasio")
                        .version("1.0.0"));
    }
}
