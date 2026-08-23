import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { API_URL } from "../api";

const STEPS = [
    {
        status: "SCANNING_PORTS",
        label: "Scanning ports",
    },
    {
        status: "DETECTING_SERVICES",
        label: "Detecting services",
    },
    {
        status: "LOOKING_UP_CVES",
        label: "Looking up CVEs",
    },
    {
        status: "SAVING_RESULTS",
        label: "Saving results",
    },
    {
        status: "COMPLETED",
        label: "Complete",
    },
];

export default function ScanProgress({ scanId, onComplete }) {
    const [current, setCurrent] = useState("SCANNING_PORTS");
    const [percent, setPercent] = useState(0);
    const [logs, setLogs] = useState([]);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        if (!scanId) {
            return;
        }

        setCurrent("SCANNING_PORTS");
        setPercent(0);
        setLogs([]);
        setFailed(false);

        const eventSource = new EventSource(
            `${API_URL}/scan/progress/${scanId}`
        );

        let scanFinished = false;

        eventSource.addEventListener("scan-progress", (e) => {
            try {
                const event = JSON.parse(e.data);

                setCurrent(event.status);
                setPercent(event.progressPercent);

                setLogs((previousLogs) => [
                    ...previousLogs,
                    event.message,
                ]);

                if (event.status === "COMPLETED") {
                    scanFinished = true;
                    eventSource.close();

                    if (onComplete) {
                        onComplete(scanId);
                    }
                }

                if (event.status === "FAILED") {
                    scanFinished = true;
                    eventSource.close();
                    setFailed(true);
                }
            } catch (error) {
                console.error(
                    "Failed to read scan progress:",
                    error
                );

                eventSource.close();
                setFailed(true);
            }
        });

        eventSource.onerror = (error) => {
            if (!scanFinished) {
                console.error(
                    "Scan progress connection failed:",
                    error
                );

                setFailed(true);
            }

            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, [scanId]);

    const currentIndex = STEPS.findIndex(
        (step) => step.status === current
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-6"
        >
            {/* Progress bar */}
            <div className="mb-5">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>
                        {failed
                            ? "Scan failed"
                            : current === "COMPLETED"
                                ? "Scan complete"
                                : "Running scan..."}
                    </span>

                    <span className="text-cyan-400 font-mono">
                        {percent}%
                    </span>
                </div>

                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                        className={`h-full rounded-full ${
                            failed
                                ? "bg-red-500"
                                : "bg-gradient-to-r from-cyan-400 to-violet-500"
                        }`}
                        animate={{ width: `${percent}%` }}
                        transition={{ duration: 0.4 }}
                    />
                </div>
            </div>

            {/* Scan steps */}
            <div className="space-y-2 mb-5">
                {STEPS.map((step, index) => {
                    const completed =
                        index < currentIndex ||
                        current === "COMPLETED";

                    const active =
                        step.status === current;

                    return (
                        <div
                            key={step.status}
                            className="flex items-center gap-3"
                        >
                            <div
                                className={`w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 font-bold ${
                                    completed
                                        ? "bg-cyan-500 text-black"
                                        : active
                                            ? "border-2 border-cyan-400"
                                            : "border border-white/20"
                                }`}
                            >
                                {completed && "✓"}

                                {active && !completed && (
                                    <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse block" />
                                )}
                            </div>

                            <span
                                className={`text-sm ${
                                    active
                                        ? "text-cyan-300"
                                        : completed
                                            ? "text-gray-500"
                                            : "text-gray-700"
                                }`}
                            >
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Terminal logs */}
            <div className="bg-black/60 rounded-lg p-4 font-mono text-xs text-green-400 space-y-1 max-h-36 overflow-y-auto">
                {logs.map((log, index) => (
                    <div key={`${index}-${log}`}>
                        <span className="text-gray-600 mr-2">
                            ›
                        </span>

                        {log}
                    </div>
                ))}

                {!failed && current !== "COMPLETED" && (
                    <div className="flex gap-2">
                        <span className="text-gray-600">
                            ›
                        </span>

                        <span className="animate-pulse text-cyan-400">
                            _
                        </span>
                    </div>
                )}
            </div>

            {/* Error message */}
            {failed && (
                <p className="mt-4 text-red-400 text-sm text-center">
                    Scan failed. Check the target and try again.
                </p>
            )}
        </motion.div>
    );
}