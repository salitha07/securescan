package com.example.securescan.service;
import org.w3c.dom.*;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;
import org.w3c.dom.*;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.example.securescan.model.ScanResult;
import com.example.securescan.repository.ScanHistoryRepository;
import com.example.securescan.entity.ScanHistory;
import org.springframework.beans.factory.annotation.Autowired;
import java.time.LocalDateTime;


import com.example.securescan.entity.ScanHistory;
import com.example.securescan.model.ScanResult;
import com.example.securescan.repository.ScanHistoryRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;

import java.time.LocalDateTime;

import java.util.ArrayList;
import java.util.List;
@Service
public class ScanService {@Autowired
    private ScanHistoryRepository scanHistoryRepository;

    public List<ScanResult> scanTarget (String target){

        List<ScanResult> results = new ArrayList<>();

        try {

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

            DocumentBuilderFactory factory =
                    DocumentBuilderFactory.newInstance();

            DocumentBuilder builder =
                    factory.newDocumentBuilder();

            Document document =
                    builder.parse(
                            new ByteArrayInputStream(
                                    xmlOutput.toString()
                                            .getBytes(StandardCharsets.UTF_8)
                            )
                    );

            document.getDocumentElement().normalize();

            NodeList ports =
                    document.getElementsByTagName("port");

            for (int i = 0; i < ports.getLength(); i++) {

                Element portElement =
                        (Element) ports.item(i);

                String port =
                        portElement.getAttribute("portid");

                Element stateElement =
                        (Element) portElement
                                .getElementsByTagName("state")
                                .item(0);

                String state =
                        stateElement.getAttribute("state");

                Element serviceElement =
                        (Element) portElement
                                .getElementsByTagName("service")
                                .item(0);

                String service =
                        serviceElement.getAttribute("name");

                String product =
                        serviceElement.getAttribute("product");

                String version =
                        serviceElement.getAttribute("version");

                String fullVersion =
                        product + " " + version;

                results.add(
                        new ScanResult(
                                port,
                                state,
                                service,
                                fullVersion
                        )
                );

                ScanHistory history = new ScanHistory(
                        target,
                        port,
                        state,
                        service,
                        fullVersion,
                        LocalDateTime.now()
                );

                scanHistoryRepository.save(history);
            }

            process.waitFor();

        } catch (Exception e) {
            e.printStackTrace();
        }

        return results;
    }
}