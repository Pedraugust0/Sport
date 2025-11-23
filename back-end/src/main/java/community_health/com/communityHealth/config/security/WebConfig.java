package community_health.com.communityHealth.config.security;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    /**
     *
     * Serve para liberar acesso do spring-boot a pasta de uploads.
     *
     * A pasta de uploads serve para guardar midia que será
     * compartilhada entre o front e o back.
     *
     * A pasta uploads está na raiz do projeto do back-end
     * */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        // Mapeia a URL http://localhost:8080/uploads/... para a pasta física "uploads/"
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/");

    }

    /**
     * Libera acesso para outros servidores poderem se comunicar com este
     * através das APIS, para não serem bloqueados por conta de CORS
     * */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Aplica a todas as rotas da API
                .allowedOrigins("http://localhost:5173") // Permite APENAS o seu Front-end React
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "TRACE", "CONNECT")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}