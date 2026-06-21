package com.example.securescan.service;

import com.example.securescan.model.CveResult;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class CveService {

    public List<CveResult> searchCves(String keyword) {

        List<CveResult> results = new ArrayList<>();

        try {

            if (keyword == null || keyword.trim().isEmpty()) {
                return results;
            }

            String encodedKeyword =
                    URLEncoder.encode(keyword.trim(), StandardCharsets.UTF_8);

            String url =
                    "https://services.nvd.nist.gov/rest/json/cves/2.0?keywordSearch="
                            + encodedKeyword;

            System.out.println("Searching NVD: " + url);

            RestTemplate restTemplate = new RestTemplate();

            Map<String, Object> response =
                    restTemplate.getForObject(url, Map.class);

            if (response == null) {
                return results;
            }

            List<?> vulnerabilities =
                    (List<?>) response.get("vulnerabilities");

            if (vulnerabilities == null) {
                return results;
            }

            for (Object obj : vulnerabilities) {

                Map<?, ?> vulnWrapper = (Map<?, ?>) obj;
                Map<?, ?> cve = (Map<?, ?>) vulnWrapper.get("cve");

                if (cve == null) {
                    continue;
                }

                String cveId = String.valueOf(cve.get("id"));

                String description = "No description available";

                List<?> descriptions =
                        (List<?>) cve.get("descriptions");

                if (descriptions != null && !descriptions.isEmpty()) {

                    Map<?, ?> firstDescription =
                            (Map<?, ?>) descriptions.get(0);

                    Object descValue =
                            firstDescription.get("value");

                    if (descValue != null) {
                        description = descValue.toString();
                    }
                }

                String severity = "UNKNOWN";

                Map<?, ?> metrics =
                        (Map<?, ?>) cve.get("metrics");

                if (metrics != null) {

                    List<?> cvss31 =
                            (List<?>) metrics.get("cvssMetricV31");

                    if (cvss31 != null && !cvss31.isEmpty()) {

                        Map<?, ?> cvssWrapper =
                                (Map<?, ?>) cvss31.get(0);

                        Map<?, ?> cvssData =
                                (Map<?, ?>) cvssWrapper.get("cvssData");

                        if (cvssData != null &&
                                cvssData.get("baseSeverity") != null) {

                            severity =
                                    cvssData.get("baseSeverity").toString();
                        }
                    }
                }

                results.add(
                        new CveResult(
                                cveId,
                                description,
                                severity
                        )
                );

                if (results.size() >= 5) {
                    break;
                }
            }

        } catch (Exception e) {

            System.err.println("NVD API Error: " + e.getMessage());

        }

        return results;
    }
}