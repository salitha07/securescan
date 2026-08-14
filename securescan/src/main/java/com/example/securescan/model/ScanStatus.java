package com.example.securescan.model;

public enum ScanStatus {
    QUEUED,
    SCANNING_PORTS,
    DETECTING_SERVICES,
    LOOKING_UP_CVES,
    SAVING_RESULTS,
    COMPLETED,
    FAILED
}