package com.example.securescan.controller;
import com.example.securescan.service.PingService;
import com.example.securescan.model.PingResult;

import com.example.securescan.entity.ScanHistory;
import com.example.securescan.entity.User;
import com.example.securescan.model.ScanRequest;
import com.example.securescan.model.ScanResult;
import com.example.securescan.repository.ScanHistoryRepository;
import com.example.securescan.repository.UserRepository;
import com.example.securescan.service.ScanProgressService;
import com.example.securescan.service.ScanService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/scan")
public class ScanController {

    @Autowired
    private ScanService scanService;

    @Autowired
    private ScanProgressService scanProgressService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ScanHistoryRepository scanHistoryRepository;

    @Autowired
    private PingService pingService;

    // ── NEW: start scan, return scanId immediately ──
    @PostMapping("/start")
    public ResponseEntity<Map<String, String>> startScan(@RequestBody ScanRequest req) {
        String scanId = UUID.randomUUID().toString();

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        // run in background — HTTP returns immediately
        CompletableFuture.runAsync(() -> scanService.scanAsync(scanId, req.getTarget(), email));

        return ResponseEntity.ok(Map.of("scanId", scanId));
    }

    // ── NEW: SSE progress stream ──
    @GetMapping(value = "/progress/{scanId}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamProgress(@PathVariable String scanId) {
        return scanProgressService.createEmitter(scanId);
    }

    // ── NEW: fetch results after scan completes ──
    @GetMapping("/results/{scanId}")
    public List<ScanResult> getResults(@PathVariable String scanId) {
        List<ScanResult> results = scanService.getResults(scanId);
        scanService.clearResults(scanId); // clean up memory
        return results;
    }

    // ── existing endpoint — keep so nothing breaks ──
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
        if (user == null) throw new RuntimeException("User not found");
        return scanHistoryRepository.findByUser(user);
    }
    @GetMapping("/ping")
    public PingResult ping(@RequestParam String target) {
        return pingService.ping(target);
    }
}