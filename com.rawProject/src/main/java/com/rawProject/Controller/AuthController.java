package com.rawProject.Controller;

import java.util.Map;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rawProject.congfig.JwtUtil;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authManager;

    @Autowired
    private JwtUtil jwtUtil;
    
    
    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Map<String, String> req) {
    	System.out.println("LOGIN API HIT");
        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        req.get("username"),
                        req.get("password")
                )
        );

        String token = jwtUtil.generateToken(req.get("username"));

        return Map.of(
                "message", "Login Success",
                "token", token
        );    }
}