package community_health.com.communityHealth.config.security;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        // Obtém o caminho absoluto do diretório de trabalho (back-end/)
        String userDir = System.getProperty("user.dir");

        // Resolve o caminho: user.dir + "../uploads"
        Path uploadPath = Paths.get(userDir, "back-end/uploads");

        // O método .normalize() é usado para limpar o '..'
        String absoluteUploadPathUri = uploadPath.normalize().toUri().toString();

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(absoluteUploadPathUri);
    }

    /**
     * Libera acesso para outros servidores poderem se comunicar com este (CORS).
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5173")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "TRACE", "CONNECT")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}