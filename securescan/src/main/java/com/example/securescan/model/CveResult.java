package com.example.securescan.model;

public class CveResult {

    private String cveId;
    private String description;
    private String severity;

    public CveResult() {
    }

    public CveResult(String cveId, String description, String severity) {
        this.cveId = cveId;
        this.description = description;
        this.severity = severity;
    }

    public String getCveId() {
        return cveId;
    }

    public void setCveId(String cveId) {
        this.cveId = cveId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }
}