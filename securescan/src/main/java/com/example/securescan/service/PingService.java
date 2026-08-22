package com.example.securescan.service;

import com.example.securescan.model.PingResult;
import org.springframework.stereotype.Service;

import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.net.Socket;

@Service
public class PingService {

    // common ports to try if ICMP fails
    private static final int[] FALLBACK_PORTS = {80, 443, 22, 21, 8080};

    public PingResult ping(String target) {
        try {
            // Step 1 — resolve hostname to IP first
            InetAddress address = InetAddress.getByName(target);
            String ipAddress = address.getHostAddress();

            // Step 2 — try ICMP ping
            long start = System.currentTimeMillis();
            boolean icmpReachable = address.isReachable(3000);
            long responseTime = System.currentTimeMillis() - start;

            if (icmpReachable) {
                return new PingResult(true, target, responseTime, ipAddress);
            }

            // Step 3 — ICMP failed (probably blocked by firewall)
            // fall back to TCP connect on common ports
            for (int port : FALLBACK_PORTS) {
                try {
                    long tcpStart = System.currentTimeMillis();
                    Socket socket = new Socket();
                    socket.connect(new InetSocketAddress(ipAddress, port), 2000);
                    long tcpTime = System.currentTimeMillis() - tcpStart;
                    socket.close();

                    // TCP connect succeeded — host is online
                    return new PingResult(true, target, tcpTime, ipAddress);

                } catch (Exception ignored) {
                    // this port is closed, try next
                }
            }

            // Step 4 — all TCP ports failed too, host is genuinely offline
            return new PingResult(false, target, -1, ipAddress);

        } catch (Exception e) {
            // hostname couldn't be resolved at all
            return new PingResult(false, target, -1, "Could not resolve host");
        }
    }
}