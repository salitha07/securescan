package com.example.securescan.service;

import com.example.securescan.model.CveResult;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class CveService {

    public List<CveResult> searchCves(String keyword) {

        List<CveResult> results = new ArrayList<>();

        try {

            String url =
                    "https://services.nvd.nist.gov/rest/json/cves/2.0?keywordSearch="
                            + keyword;

            RestTemplate restTemplate = new RestTemplate();

            Map response =
                    restTemplate.getForObject(url, Map.class);

            List vulnerabilities =
                    (List) response.get("vulnerabilities");

            if (vulnerabilities != null) {

                for (Object obj : vulnerabilities) {

                    Map vulnWrapper = (Map) obj;

                    Map cve = (Map) vulnWrapper.get("cve");

                    String cveId =
                            (String) cve.get("id");

                    String description = "";

                    List descriptions =
                            (List) cve.get("descriptions");

                    if (descriptions != null && !descriptions.isEmpty()) {

                        Map firstDescription =
                                (Map) descriptions.get(0);

                        description =
                                (String) firstDescription.get("value");
                    }

                    String severity = "UNKNOWN";

                    Map metrics =
                            (Map) cve.get("metrics");

                    if (metrics != null &&
                            metrics.get("cvssMetricV31") != null) {

                        List cvssList =
                                (List) metrics.get("cvssMetricV31");

                        if (!cvssList.isEmpty()) {

                            Map cvssWrapper =
                                    (Map) cvssList.get(0);

                            Map cvssData =
                                    (Map) cvssWrapper.get("cvssData");

                            severity =
                                    (String) cvssData.get("baseSeverity");
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
            }

        } catch (Exception e) {

            e.printStackTrace();
        }

        return results;
    }
}