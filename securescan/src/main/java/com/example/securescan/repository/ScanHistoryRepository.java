package com.example.securescan.repository;

import com.example.securescan.entity.ScanHistory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ScanHistoryRepository
        extends JpaRepository<ScanHistory, Long> {
}