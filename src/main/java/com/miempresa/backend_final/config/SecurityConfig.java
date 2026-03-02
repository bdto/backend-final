package com.miempresa.backend_final.config;

import com.miempresa.backend_final.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableReactiveMethodSecurity;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
@EnableWebFluxSecurity
@EnableReactiveMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        return http
            .csrf(ServerHttpSecurity.CsrfSpec::disable)
            .httpBasic(ServerHttpSecurity.HttpBasicSpec::disable)
            .formLogin(ServerHttpSecurity.FormLoginSpec::disable)
            .authorizeExchange(exchanges -> exchanges
                // Tarea 1 - Rutas de demo
                .pathMatchers("/public").permitAll()
                .pathMatchers("/user").hasAnyAuthority("ROLE_USER", "ROLE_ADMIN")
                .pathMatchers("/admin").hasAuthority("ROLE_ADMIN")
                // Auth - acceso libre
                .pathMatchers(HttpMethod.POST, "/api/v1/auth/**").permitAll()
                // Productos - lectura publica, escritura solo admin
                .pathMatchers(HttpMethod.GET, "/api/v1/products/**").permitAll()
                .pathMatchers(HttpMethod.POST, "/api/v1/products/**").hasAuthority("ROLE_ADMIN")
                // Todo lo demas requiere autenticacion
                .anyExchange().authenticated()
            )
            .addFilterAt(jwtFilter, SecurityWebFiltersOrder.AUTHENTICATION)
            .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}