package com.miempresa.backend_final.service;

import com.miempresa.backend_final.dto.AuthRequest;
import com.miempresa.backend_final.dto.AuthResponse;
import com.miempresa.backend_final.dto.RegisterRequest;
import com.miempresa.backend_final.entity.User;
import com.miempresa.backend_final.repository.UserRepository;
import com.miempresa.backend_final.security.JwtService;
import org.springframework.context.MessageSource;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.Locale;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final MessageSource messageSource;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       MessageSource messageSource) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.messageSource = messageSource;
    }

    // RF1 - Registro
    public Mono<AuthResponse> register(RegisterRequest req, Locale locale) {
        return userRepository.existsByUsername(req.username())
            .flatMap(exists -> {
                if (exists) {
                    String msg = messageSource.getMessage(
                        "error.username.exists", null, locale);
                    return Mono.<AuthResponse>error(new IllegalArgumentException(msg));
                }
                return userRepository.existsByEmail(req.email())
                    .flatMap(emailExists -> {
                        if (emailExists) {
                            String msg = messageSource.getMessage(
                                "error.email.exists", null, locale);
                            return Mono.<AuthResponse>error(new IllegalArgumentException(msg));
                        }
                        User user = new User();
                        user.setUsername(req.username());
                        user.setPassword(passwordEncoder.encode(req.password()));
                        user.setEmail(req.email());
                        user.setRole("ROLE_USER");
                        user.setActive(true);

                        return userRepository.save(user)
                            .map(saved -> new AuthResponse(
                                jwtService.generateToken(saved.getUsername(), saved.getRole()),
                                saved.getUsername(),
                                saved.getRole()
                            ));
                    });
            });
    }

    // RF2 - Login
    public Mono<AuthResponse> login(AuthRequest req, Locale locale) {
        return userRepository.findByUsername(req.username())
            .filter(user -> passwordEncoder.matches(req.password(), user.getPassword()))
            .map(user -> new AuthResponse(
                jwtService.generateToken(user.getUsername(), user.getRole()),
                user.getUsername(),
                user.getRole()
            ))
            .switchIfEmpty(Mono.error(new IllegalArgumentException(
                messageSource.getMessage("error.invalid.credentials", null, locale)
            )));
    }

    // RF3 - Solicitar recuperacion de contrasena
    public Mono<String> requestPasswordReset(String email, Locale locale) {
        return userRepository.findByEmail(email)
            .switchIfEmpty(Mono.error(new IllegalArgumentException(
                messageSource.getMessage("error.email.not.found", null, locale)
            )))
            .map(user -> {
                String resetToken = UUID.randomUUID().toString();
                return resetToken;
            });
    }

    // RF3 - Confirmar nueva contrasena
    public Mono<String> confirmPasswordReset(String token, String newPassword, Locale locale) {
        return Mono.just(
            messageSource.getMessage("password.reset.success", null, locale)
        );
    }
}