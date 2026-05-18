package com.example.securescan.controller;

import com.example.securescan.entity.user;
import com.example.securescan.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping("/register")
    public String registerUser(@RequestBody user user) {

        // Check if email already exists
        if(userRepository.findByEmail(user.getEmail()).isPresent()) {
            return "Email already registered!";
        }

        // Encrypt password
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Set default role
        user.setRole("USER");

        // Save user
        userRepository.save(user);

        return "User registered successfully!";
    }
}