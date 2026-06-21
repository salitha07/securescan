package com.example.securescan.repository;

import com.example.securescan.entity.ScanHistory;
import com.example.securescan.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ScanHistoryRepository extends JpaRepository<ScanHistory, Long> {

    List<ScanHistory> findByUser(User user);

}