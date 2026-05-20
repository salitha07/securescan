package com.example.securescan.service;

import com.example.securescan.model.ScanResult;
import com.example.securescan.repository.ScanHistoryRepository;
import com.example.securescan.entity.ScanHistory;
import org.springframework.beans.factory.annotation.Autowired;
import java.time.LocalDateTime;


import com.example.securescan.entity.ScanHistory;
import com.example.securescan.model.ScanResult;
import com.example.securescan.repository.ScanHistoryRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;

import java.time.LocalDateTime;

import java.util.ArrayList;
import java.util.List;
@Service
public class ScanService {
    @Autowired
    private ScanHistoryRepository scanHistoryRepository;

    public List<ScanResult> scanTarget(String target) {

        List<ScanResult> results = new ArrayList<>();

        try {
            ProcessBuilder processBuilder =
                    new ProcessBuilder("nmap", "-sV", target);

            Process process = processBuilder.start();

            BufferedReader reader = new BufferedReader(
                    new InputStreamReader(process.getInputStream())
            );

            String line;

            while ((line = reader.readLine()) != null) {

                if (line.contains("/tcp") || line.contains("/udp")) {

                    String[] parts = line.trim().split("\\s+");

                    String port = parts.length > 0 ? parts[0] : "";
                    String state = parts.length > 1 ? parts[1] : "";
                    String service = parts.length > 2 ? parts[2] : "";
                    String version = "";

                    if (parts.length > 3) {
                        StringBuilder versionBuilder = new StringBuilder();

                        for (int i = 3; i < parts.length; i++) {
                            versionBuilder.append(parts[i]).append(" ");
                        }

                        version = versionBuilder.toString().trim();
                    }

                    results.add(
                            new ScanResult(port, state, service, version)
                    );
                    ScanHistory history = new ScanHistory(
                            target,
                            port,
                            state,
                            service,
                            version,
                            LocalDateTime.now()
                    );

                    scanHistoryRepository.save(history);
                }
            }

            process.waitFor();

        } catch (Exception e) {
            e.printStackTrace();
        }

        return results;
    }
}