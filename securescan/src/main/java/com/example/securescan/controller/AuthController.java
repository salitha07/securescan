package com.example.securescan.controller;

import com.example.securescan.entity.User;
import com.example.securescan.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.env.OriginTrackedMapPropertySource;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;


@RestController
@RequestMapping("/auth")
@CrossOrigin (origins= "http://localhost:5173")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping("/register")
    public String registerUser(@RequestBody User user) {

        // Check if email already exists
        if (userRepository.findByEmail(user.getEmail()) != null) {
            return "Email already registered!";
        }

        // Encrypt password
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Set default role
        user.setRole("USER");

        // Save User
        userRepository.save(user);

        return "User registered successfully!";
    }
    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody User user) {

        User existingUser =
                userRepository.findByEmail(user.getEmail());

        if (existingUser == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("User not found");
        }

        if (!passwordEncoder.matches(
                user.getPassword(),
                existingUser.getPassword()
        )) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid password");
        }

        return ResponseEntity.ok("Login successful");
    }
}