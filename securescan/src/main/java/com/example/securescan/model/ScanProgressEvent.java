package com.example.securescan.model;

public class ScanProgressEvent {

    private ScanStatus status;
    private String message;
    private int progressPercent;
    private String scanId;

    public ScanProgressEvent(ScanStatus status, String message,
                             int progressPercent, String scanId) {
        this.status = status;
        this.message = message;
        this.progressPercent = progressPercent;
        this.scanId = scanId;
    }

    public ScanStatus getStatus() { return status; }
    public String getMessage() { return message; }
    public int getProgressPercent() { return progressPercent; }
    public String getScanId() { return scanId; }
}