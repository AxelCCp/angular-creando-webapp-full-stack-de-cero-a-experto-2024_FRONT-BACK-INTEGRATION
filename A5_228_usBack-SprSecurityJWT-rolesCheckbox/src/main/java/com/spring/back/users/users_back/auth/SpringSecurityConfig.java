package com.spring.back.users.users_back.auth;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import com.spring.back.users.users_back.auth.filter.JwtAuthenticationFilter;
import com.spring.back.users.users_back.auth.filter.JwtValidationFilter;

@Configuration
public class SpringSecurityConfig {

    @Autowired
    private AuthenticationConfiguration authenticationConfiguration;


    @Bean
    AuthenticationManager authenticationManager() throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    
    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
       
        return http.authorizeHttpRequests(authorize -> 
                            authorize
                            .requestMatchers(HttpMethod.GET, "/api/users", "/api/users/page/{page}").permitAll()
                            .requestMatchers(HttpMethod.GET, "/api/users/{id}").hasAnyRole("USER","ADMIN")
                            .requestMatchers(HttpMethod.POST, "/api/users").hasRole("ADMIN")
                            .requestMatchers(HttpMethod.PUT, "/api/users/{id}").hasRole("ADMIN")
                            .requestMatchers(HttpMethod.DELETE, "/api/users/{id}").hasRole("ADMIN")
                            .anyRequest().authenticated())
                            .cors(cors -> cors.configurationSource(this.configurationSource()))                      //se pasa el cors a Spring security.
                            .addFilter(new JwtAuthenticationFilter(authenticationManager()))
                            .addFilter(new JwtValidationFilter(authenticationManager()))
                            .csrf(config -> config.disable())
                            .sessionManagement(management -> management.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                            .build();
    }


    //170 - para darle acceso a Angular en spring security
    @Bean
    CorsConfigurationSource configurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(Arrays.asList("*"));
        config.setAllowedOrigins(Arrays.asList("http://localhost:4200"));
        config.setAllowedMethods(Arrays.asList("POST", "GET", "PUT", "DELETE"));
        config.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        config.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();     //para indicar donde se va a aplicar este filtro de cors.
        source.registerCorsConfiguration("/**", config);                                    // "/**"  se va a aplicar a todas las rutas.
        return source;
    }


    //170 - se pasa el cors a los filtro de la aplicacion

    @Bean
    FilterRegistrationBean<CorsFilter> corsFilter() {
        FilterRegistrationBean<CorsFilter>corsBean = new FilterRegistrationBean<>(new CorsFilter(this.configurationSource()));
        corsBean.setOrder(Ordered.HIGHEST_PRECEDENCE);
        return corsBean;
    }

}
