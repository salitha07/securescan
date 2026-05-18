package com.example.securescan.model;

public class ScanResult {

    private String port;
    private String state;
    private String service;
    private String version;

    public ScanResult(String port, String state, String service, String version) {
        this.port = port;
        this.state = state;
        this.service = service;
        this.version = version;
    }

    public String getPort() {
        return port;
    }

    public String getState() {
        return state;
    }

    public String getService() {
        return service;
    }

    public String getVersion() {
        return version;
    }
}