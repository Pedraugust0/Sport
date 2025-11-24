package community_health.com.communityHealth.config.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {

        httpSecurity

                // DESABILITA O CSRF E MANDA O CORS USAR A NOSSA OCNFIG
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configure(httpSecurity))

                // CONFIGURA SE PRECISA DE AUTENTICAÇÃO NOS ENDPOINTS
                .authorizeHttpRequests(authorize -> authorize

                        // Permite acesso explícito aos recursos estáticos (upload)
                        // para garantir que a requisição não seja interceptada.
                        .requestMatchers("/uploads/**").permitAll()
                        .requestMatchers("/api/auth/**").permitAll()

                        // Permite acesso a todos os outros requests
                        .anyRequest().permitAll()
                )

                // CONFIGURA ENDPOINT DE LOGIN
                .formLogin(form -> form
                        .loginProcessingUrl("/api/auth/login")
                        .usernameParameter("email") // Usa 'email' no body para o login
                        .passwordParameter("password")
                        .successHandler((request, response, authentication) -> {
                            response.setStatus(200);
                            response.getWriter().write("{\"message\": \"Login bem-sucedido!\"}"); // Resposta de sucesso
                        })
                        .failureHandler((request, response, exception) -> {
                            response.setStatus(401);
                            response.getWriter().write("{\"error\": \"E-mail ou senha invalidos.\"}"); // Resposta de falha
                        })
                        .permitAll()
                )

                // CONFIGURA ENDPOINT DE CADASTRO
                .logout(logout -> logout
                        // Usa o método de conveniência para configurar o path e o método POST
                        .logoutUrl("/api/auth/logout")
                        .invalidateHttpSession(true)
                        .deleteCookies("JSESSIONID")
                        .logoutSuccessHandler((request, response, authentication) -> {
                            response.setStatus(200);
                            response.getWriter().write("{\"message\": \"Logout bem-sucedido!\"}");
                        })
                );

        return httpSecurity.build();
    }

}