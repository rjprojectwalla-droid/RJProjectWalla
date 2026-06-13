package com.rawProject.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import com.rawProject.entity.Admin;
import com.rawProject.repository.AdminRepository;

@Service
public class AdminUserDetailsService implements UserDetailsService {

    @Autowired
    private AdminRepository adminRepository;

    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {

        Admin admin = adminRepository.findByUsername(username)
                .orElseThrow(() ->
                        new UsernameNotFoundException("Admin not found"));

        return User.builder()
                .username(admin.getUsername())
                .password("{noop}" + admin.getPassword())
                .roles("ADMIN")
                .build();
    }
}