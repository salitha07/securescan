package com.example.securescan.entity;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
public class ScanHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String target;
    private String port;
    private String state;
    private String service;
    private String version;

    private LocalDateTime scanDate;

    public ScanHistory() {
    }

    public ScanHistory(String target,
                       String port,
                       String state,
                       String service,
                       String version,
                       LocalDateTime scanDate) {

        this.target = target;
        this.port = port;
        this.state = state;
        this.service = service;
        this.version = version;
        this.scanDate = scanDate;
    }
    @lombok.Setter
    @lombok.Getter
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @JsonManagedReference
    @OneToMany(
            mappedBy = "scanHistory",
            cascade = CascadeType.ALL,
            fetch = FetchType.EAGER
    )


    private List<Vulnerability> vulnerabilities = new ArrayList<>();


    public Long getId() {
        return id;
    }

    public String getTarget() {
        return target;
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

    public LocalDateTime getScanDate() {
        return scanDate;
    }
    public List<Vulnerability> getVulnerabilities() {
        return vulnerabilities;
    }

}