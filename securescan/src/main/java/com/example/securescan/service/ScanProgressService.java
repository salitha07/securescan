package com.example.securescan.service;

import com.example.securescan.model.ScanProgressEvent;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ScanProgressService {

    private final Map<String, SseEmitter> emitters = new ConcurrentHashMap<>();

    public SseEmitter createEmitter(String scanId) {
        SseEmitter emitter = new SseEmitter(300_000L); // 5 min timeout
        emitters.put(scanId, emitter);
        emitter.onCompletion(() -> emitters.remove(scanId));
        emitter.onTimeout(() -> emitters.remove(scanId));
        return emitter;
    }

    public void send(String scanId, ScanProgressEvent event) {
        SseEmitter emitter = emitters.get(scanId);
        if (emitter == null) return;
        try {
            emitter.send(SseEmitter.event()
                    .name("scan-progress")
                    .data(event));
        } catch (IOException e) {
            emitters.remove(scanId);
        }
    }

    public void complete(String scanId) {
        SseEmitter emitter = emitters.get(scanId);
        if (emitter != null) {
            emitter.complete();
            emitters.remove(scanId);
        }
    }
}