package com.example.securescan.controller;

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
    private ScanHistoryRepository scanHistoryRepository;

    @GetMapping
    public List<ScanResult> scan(@RequestParam String target) {
        return scanService.scanTarget(target);
    }

    @GetMapping("/history")
    public List<ScanHistory> getScanHistory() {
        return scanHistoryRepository.findAll();
    }
}