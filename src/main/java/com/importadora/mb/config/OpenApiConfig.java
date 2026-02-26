package com.importadora.mb.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI importadoraMbOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Importadora MB API")
                        .description("API REST para gestión de clientes y autenticación de usuarios")
                        .version("1.0.0"));
    }
}
