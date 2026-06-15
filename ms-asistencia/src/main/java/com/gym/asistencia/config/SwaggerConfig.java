package com.gym.asistencia.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {
    @Bean
    public OpenAPI gymAsistenciaOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("MS-Asistencia")
                        .description("API de registro de asistencia al gimnasio")
                        .version("1.0.0"));
    }
}
