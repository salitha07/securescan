package com.example.securescan.controller;
import com.example.securescan.entity.User;
import com.example.securescan.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.example.securescan.entity.ScanHistory;
import com.example.securescan.model.ScanResult;
import com.example.securescan.repository.ScanHistoryRepository;
import com.example.securescan.service.ScanService;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/scan")
@CrossOrigin(origins = "http://localhost:5173")
public class ScanController {


    @Autowired
    private ScanService scanService;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ScanHistoryRepository scanHistoryRepository;

    @GetMapping
    public List<ScanResult> scan(@RequestParam String target) {
        return scanService.scanTarget(target);
    }

    @GetMapping("/history")
    public List<ScanHistory> getScanHistory() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email);

        if (user == null) {
            throw new RuntimeException("User not found");
        }

        return scanHistoryRepository.findByUser(user);
    }
}