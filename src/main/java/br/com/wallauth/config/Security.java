package br.com.wallauth.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class Security {


    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // 1. Desabilita CSRF (Essencial para APIs REST com JWT)
                .csrf(AbstractHttpConfigurer::disable)

                // 2. Configura o CORS usando o Bean que vamos criar abaixo
                .cors(Customizer.withDefaults())

                // 3. Gerenciamento de sessão (STATELESS para JWT)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // 4. Permissões de endpoints
                .authorizeHttpRequests(auth -> auth
                        // LIBERA explicitamente o método OPTIONS para o navegador não travar
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        // LIBERA endpoints públicos
                        .requestMatchers("/login/**", "/register/**", "/password/**").permitAll()
                        .anyRequest().authenticated()
                );
        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        // Origens do Ionic: browser dev, Capacitor iOS/Android, Cordova
        config.setAllowedOriginPatterns(List.of(
                "http://localhost:4200",  // Angular dev
                "http://localhost:8100",  // Ionic dev
                "http://localhost",
                "capacitor://localhost",
                "ionic://localhost"
        ));
        config.setExposedHeaders(List.of("Authorization", "X-Request-ID"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

}
