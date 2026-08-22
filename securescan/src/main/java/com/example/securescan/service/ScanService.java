package com.example.securescan.service;
import com.example.securescan.model.PingResult;
import com.example.securescan.service.PingService;
import com.example.securescan.entity.ScanHistory;
import com.example.securescan.entity.User;
import com.example.securescan.entity.Vulnerability;
import com.example.securescan.model.CveResult;
import com.example.securescan.model.ScanProgressEvent;
import com.example.securescan.model.ScanResult;
import com.example.securescan.model.ScanStatus;
import com.example.securescan.repository.ScanHistoryRepository;
import com.example.securescan.repository.UserRepository;
import com.example.securescan.repository.VulnerabilityRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import org.w3c.dom.*;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ScanService {

    @Autowired
    private ScanHistoryRepository scanHistoryRepository;

    @Autowired
    private VulnerabilityRepository vulnerabilityRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CveService cveService;

    @Autowired
    private ScanProgressService scanProgressService;

    @Autowired
    private PingService pingService;

    @Autowired
    private PingService PingService;

    // store results by scanId so controller can fetch them after scan
    private final Map<String, List<ScanResult>> scanResults = new ConcurrentHashMap<>();

    public void scanAsync(String scanId, String target, String email) {
        try {emit(scanId, ScanStatus.SCANNING_PORTS, "Checking host availability...", 5);
            PingResult ping = pingService.ping(target);

            if (!ping.isReachable()) {
                emit(scanId, ScanStatus.FAILED,
                        "Host " + target + " is unreachable — scan aborted", 0);
                scanProgressService.complete(scanId);
                return;
            }

            emit(scanId, ScanStatus.SCANNING_PORTS,
                    "Host is ONLINE (" + ping.getResponseTimeMs() + "ms) — starting port scan...", 10);
            emit(scanId, ScanStatus.SCANNING_PORTS, "Starting Nmap scan on " + target, 10);

            User user = userRepository.findByEmail(email);
            if (user == null) {
                emit(scanId, ScanStatus.FAILED, "User not found", 0);
                return;
            }

            ProcessBuilder processBuilder =
                    new ProcessBuilder("nmap", "-sV", "-oX", "-", target);
            Process process = processBuilder.start();

            BufferedReader reader = new BufferedReader(
                    new InputStreamReader(process.getInputStream())
            );

            StringBuilder xmlOutput = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                xmlOutput.append(line);
            }

            emit(scanId, ScanStatus.DETECTING_SERVICES, "Parsing open ports and services...", 40);

            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            DocumentBuilder builder = factory.newDocumentBuilder();
            Document document = builder.parse(
                    new ByteArrayInputStream(
                            xmlOutput.toString().getBytes(StandardCharsets.UTF_8)
                    )
            );
            document.getDocumentElement().normalize();

            NodeList ports = document.getElementsByTagName("port");
            List<ScanResult> results = new ArrayList<>();

            emit(scanId, ScanStatus.LOOKING_UP_CVES,
                    "Found " + ports.getLength() + " ports — looking up CVEs...", 60);

            for (int i = 0; i < ports.getLength(); i++) {

                Element portElement = (Element) ports.item(i);
                String port = portElement.getAttribute("portid");

                Element stateElement =
                        (Element) portElement.getElementsByTagName("state").item(0);
                String state = stateElement.getAttribute("state");

                Element serviceElement =
                        (Element) portElement.getElementsByTagName("service").item(0);
                String service = serviceElement.getAttribute("name");
                String product = serviceElement.getAttribute("product");
                String version = serviceElement.getAttribute("version");
                String fullVersion = product + " " + version;

                List<CveResult> cves = cveService.searchCves(fullVersion);

                ScanResult scanResult = new ScanResult(port, state, service, fullVersion);
                scanResult.setCves(cves);
                results.add(scanResult);

                emit(scanId, ScanStatus.LOOKING_UP_CVES,
                        "Port " + port + " — " + service + " — " + cves.size() + " CVEs found",
                        60 + (int)((i + 1.0) / ports.getLength() * 25));
            }

            emit(scanId, ScanStatus.SAVING_RESULTS, "Saving results to database...", 90);

            for (ScanResult result : results) {
                ScanHistory history = new ScanHistory(
                        target, result.getPort(), result.getState(),
                        result.getService(), result.getVersion(), LocalDateTime.now()
                );
                history.setUser(user);
                history = scanHistoryRepository.save(history);

                if (result.getCves() != null && !result.getCves().isEmpty()) {
                    for (CveResult cve : result.getCves()) {
                        Vulnerability vulnerability = new Vulnerability();
                        vulnerability.setCveId(cve.getCveId());
                        vulnerability.setDescription(cve.getDescription());
                        vulnerability.setSeverity(cve.getSeverity());
                        vulnerability.setScanHistory(history);
                        vulnerabilityRepository.save(vulnerability);
                    }
                }
            }

            process.waitFor();

            // store results so the frontend can fetch them
            scanResults.put(scanId, results);

            emit(scanId, ScanStatus.COMPLETED, "Scan complete — " + results.size() + " ports scanned", 100);
            scanProgressService.complete(scanId);

        } catch (Exception e) {
            e.printStackTrace();
            emit(scanId, ScanStatus.FAILED, "Scan failed: " + e.getMessage(), 0);
            scanProgressService.complete(scanId);
        }
    }

    public List<ScanResult> getResults(String scanId) {
        return scanResults.getOrDefault(scanId, new ArrayList<>());
    }

    public void clearResults(String scanId) {
        scanResults.remove(scanId);
    }

    private void emit(String scanId, ScanStatus status, String message, int percent) {
        scanProgressService.send(scanId, new ScanProgressEvent(status, message, percent, scanId));
    }

    // keep old method so nothing else breaks
    public List<ScanResult> scanTarget(String target) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        String tempId = java.util.UUID.randomUUID().toString();
        scanAsync(tempId, target, email);
        return getResults(tempId);
    }
}