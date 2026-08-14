import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const STEPS = [
    { status: "SCANNING_PORTS",     label: "Scanning ports" },
    { status: "DETECTING_SERVICES", label: "Detecting services" },
    { status: "LOOKING_UP_CVES",    label: "Looking up CVEs" },
    { status: "SAVING_RESULTS",     label: "Saving results" },
    { status: "COMPLETED",          label: "Complete" },
];

export default function ScanProgress({ scanId, onComplete }) {
    const [current, setCurrent]   = useState("SCANNING_PORTS");
    const [percent, setPercent]   = useState(0);
    const [logs, setLogs]         = useState([]);
    const [failed, setFailed]     = useState(false);

    useEffect(() => {
        if (!scanId) return;

        const es = new EventSource(
            `http://localhost:8080/scan/progress/${scanId}`
        );

        es.addEventListener("scan-progress", (e) => {
            const event = JSON.parse(e.data);
            setCurrent(event.status);
            setPercent(event.progressPercent);
            setLogs(prev => [...prev, event.message]);

            if (event.status === "COMPLETED") {
                es.close();
                onComplete(scanId);
            }
            if (event.status === "FAILED") {
                es.close();
                setFailed(true);
            }
        });

        es.onerror = () => {
            es.close();
            setFailed(true);
        };

        return () => es.close();
    }, [scanId]);

    const currentIdx = STEPS.findIndex(s => s.status === current);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-black/40 backdrop-blur-md border border-white/10
                       rounded-xl p-6"
        >
            {/* Progress bar */}
            <div className="mb-5">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Running scan...</span>
                    <span className="text-cyan-400 font-mono">{percent}%</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-cyan-400 to-violet-500 rounded-full"
                        animate={{ width: `${percent}%` }}
                        transition={{ duration: 0.4 }}
                    />
                </div>
            </div>

            {/* Step indicators */}
            <div className="space-y-2 mb-5">
                {STEPS.map((step, i) => {
                    const done   = i < currentIdx || current === "COMPLETED";
                    const active = step.status === current;
                    return (
                        <div key={step.status} className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full flex items-center 
                                            justify-center text-xs shrink-0 font-bold
                                            ${done   ? "bg-cyan-500 text-black" :
                                active ? "border-2 border-cyan-400" :
                                    "border border-white/20"}`}>
                                {done && "✓"}
                                {active && !done && (
                                    <span className="w-2 h-2 bg-cyan-400 rounded-full
                                                     animate-pulse block" />
                                )}
                            </div>
                            <span className={`text-sm ${
                                active ? "text-cyan-300" :
                                    done   ? "text-gray-500" : "text-gray-700"
                            }`}>
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Terminal log */}
            <div className="bg-black/60 rounded-lg p-4 font-mono text-xs
                            text-green-400 space-y-1 max-h-36 overflow-y-auto">
                {logs.map((log, i) => (
                    <div key={i}>
                        <span className="text-gray-600 mr-2">›</span>{log}
                    </div>
                ))}
                {!failed && current !== "COMPLETED" && (
                    <div className="flex gap-2">
                        <span className="text-gray-600">›</span>
                        <span className="animate-pulse text-cyan-400">_</span>
                    </div>
                )}
            </div>

            {failed && (
                <p className="mt-4 text-red-400 text-sm text-center">
                    Scan failed. Check the target and try again.
                </p>
            )}
        </motion.div>
    );
}