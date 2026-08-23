import { useState } from "react";
import api from "../api";
import { motion, AnimatePresence } from "framer-motion";

export default function PingChecker({ target }) {

    const [result, setResult]   = useState(null);
    const [loading, setLoading] = useState(false);

    const handlePing = async () => {
        if (!target) return;
        try {
            setLoading(true);
            setResult(null);
            const res = await api.get("/scan/ping", {
                params: {
                    target
                }
            });
            setResult(res.data);
        } catch (err) {
            setResult({ reachable: false, status: "ERROR", responseTimeMs: -1 });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-3">
            <button
                onClick={handlePing}
                disabled={loading || !target}
                className="w-full py-2 rounded-lg border border-white/20
                           text-sm text-gray-300 hover:border-cyan-400
                           hover:text-cyan-300 transition-all
                           disabled:opacity-40 disabled:cursor-not-allowed"
            >
                {loading ? (
                    <span className="flex items-center justify-center gap-2">
                        <span className="w-3 h-3 border-2 border-cyan-400
                                         border-t-transparent rounded-full
                                         animate-spin" />
                        Pinging...
                    </span>
                ) : (
                    "⚡ Check Host Availability"
                )}
            </button>

            <AnimatePresence>
                {result && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 rounded-lg overflow-hidden"
                    >
                        <div className={`p-4 rounded-lg border flex items-center 
                                         justify-between
                                         ${result.reachable
                            ? "bg-green-900/20 border-green-600/40"
                            : "bg-red-900/20 border-red-600/40"}`}>
                            <div className="flex items-center gap-3">
                                {/* pulsing dot */}
                                <span className={`w-3 h-3 rounded-full shrink-0
                                    ${result.reachable
                                    ? "bg-green-400 animate-pulse"
                                    : "bg-red-400"}`}
                                />
                                <div>
                                    <p className={`font-semibold text-sm
                                        ${result.reachable
                                        ? "text-green-400"
                                        : "text-red-400"}`}>
                                        {result.status}
                                    </p>
                                    {result.ipAddress && (
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            {result.ipAddress}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {result.reachable && result.responseTimeMs >= 0 && (
                                <div className="text-right">
                                    <p className="text-xs text-gray-500">
                                        Response time
                                    </p>
                                    <p className={`font-mono font-bold text-sm
                                        ${result.responseTimeMs < 100
                                        ? "text-green-400"
                                        : result.responseTimeMs < 300
                                            ? "text-yellow-400"
                                            : "text-red-400"}`}>
                                        {result.responseTimeMs}ms
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}