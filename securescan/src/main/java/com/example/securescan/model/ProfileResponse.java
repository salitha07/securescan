package com.example.securescan.model;

public record ProfileResponse(
        Long id,
        String name,
        String email,
        String role
) {
}
