package com.rawProject.congfig;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.rawProject.service.AdminUserDetailsService;

@Configuration
public class SecurityConfig {
	@Autowired
	private AdminUserDetailsService adminUserDetailsService;

	
	@Autowired
	private JwtAuthenticationFilter jwtAuthenticationFilter;
	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

		http
	    .cors(cors -> {})
	    .csrf(csrf -> csrf.disable())
	        .authorizeHttpRequests(auth -> auth
	        	    .requestMatchers("/auth/**").permitAll()
	        	    .requestMatchers(HttpMethod.GET, "/api/projects").permitAll()

	        	    .requestMatchers(HttpMethod.POST, "/api/projects").authenticated()
	        	    .requestMatchers(HttpMethod.PUT, "/api/projects/**").authenticated()
	        	    .requestMatchers(HttpMethod.DELETE, "/api/projects/**").authenticated()

	        	    .anyRequest().authenticated()
	        	)
	        .addFilterBefore(
	            jwtAuthenticationFilter,
	            UsernamePasswordAuthenticationFilter.class
	        );

	    return http.build();
	}

	// ✅ THIS WAS MISSING
	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
		return config.getAuthenticationManager();
	}
}