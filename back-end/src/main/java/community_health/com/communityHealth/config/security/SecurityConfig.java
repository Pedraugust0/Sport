package community_health.com.communityHealth.config.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {

        httpSecurity
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configure(httpSecurity))
                .authorizeHttpRequests(authorize -> authorize
                        // Permite acesso explícito aos recursos estáticos (upload)
                        // para garantir que a requisição não seja interceptada.
                        .requestMatchers("/uploads/**").permitAll()

                        // Permite acesso a todos os outros requests
                        .anyRequest().permitAll()
                );

        return httpSecurity.build();
    }

}