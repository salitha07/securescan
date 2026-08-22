package com.example.securescan.model;

public class PingResult {

    private boolean reachable;
    private String host;
    private long responseTimeMs;
    private String status;
    private String ipAddress;

    public PingResult(boolean reachable, String host,
                      long responseTimeMs, String ipAddress) {
        this.reachable = reachable;
        this.host = host;
        this.responseTimeMs = responseTimeMs;
        this.ipAddress = ipAddress;
        this.status = reachable ? "ONLINE" : "OFFLINE";
    }

    public boolean isReachable()      { return reachable; }
    public String getHost()           { return host; }
    public long getResponseTimeMs()   { return responseTimeMs; }
    public String getStatus()         { return status; }
    public String getIpAddress()      { return ipAddress; }
}