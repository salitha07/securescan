import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar.jsx";
import Toast from "../components/Toast";

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: #060B18; font-family: 'Inter', system-ui, sans-serif; -webkit-font-smoothing: antialiased; }

.results-root { min-height: 100vh; background: #060B18; padding: 100px 24px 60px; }
.results-inner { max-width: 860px; margin: 0 auto; }

.results-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; flex-wrap: wrap; gap: 16px; }
.results-title { font-size: 30px; font-weight: 800; color: #F1F5F9; letter-spacing: -0.025em; }
.results-target {
    display: inline-flex; align-items: center; gap: 6px;
    margin-top: 8px; padding: 4px 12px;
    background: rgba(0,229,255,0.06); border: 1px solid rgba(0,229,255,0.15);
    border-radius: 6px; font-size: 13px; color: #00E5FF;
    font-family: 'JetBrains Mono', monospace;
}
.results-back {
    padding: 9px 18px; border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.04);
    color: #94A3B8; font-size: 13px; font-weight: 500;
    cursor: pointer; transition: border-color 0.2s, color 0.2s;
    font-family: inherit;
}
.results-back:hover { border-color: rgba(255,255,255,0.2); color: #E2E8F0; }

/* Summary stats */
.results-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; margin-bottom: 28px; }
.stat-card {
    background: rgba(14,21,40,0.8); border: 1px solid rgba(255,255,255,0.06);
    border-radius: 14px; padding: 16px 20px;
}
.stat-label { font-size: 11px; font-weight: 600; color: #475569; letter-spacing: 0.07em; text-transform: uppercase; margin-bottom: 6px; }
.stat-value { font-size: 26px; font-weight: 800; letter-spacing: -0.02em; }

/* Port cards */
.port-card {
    background: rgba(14,21,40,0.7); border: 1px solid rgba(255,255,255,0.06);
    border-radius: 16px; margin-bottom: 14px;
    overflow: hidden; transition: border-color 0.2s;
}
.port-card:hover { border-color: rgba(0,229,255,0.15); }
.port-card-header { display: flex; justify-content: space-between; align-items: center; padding: 18px 22px; cursor: pointer; }
.port-left { display: flex; align-items: center; gap: 16px; }
.port-num {
    background: rgba(0,229,255,0.07); border: 1px solid rgba(0,229,255,0.15);
    border-radius: 10px; padding: 8px 14px; text-align: center; min-width: 72px;
}
.port-num-label { font-size: 10px; color: #334155; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; }
.port-num-value { font-size: 20px; font-weight: 800; color: #00E5FF; font-family: 'JetBrains Mono', monospace; line-height: 1.2; }
.port-service { font-size: 15px; font-weight: 600; color: #E2E8F0; }
.port-version { font-size: 12px; color: #475569; margin-top: 3px; font-family: 'JetBrains Mono', monospace; }
.port-right { display: flex; align-items: center; gap: 8px; }

.badge { padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 600; }
.badge-open   { background: rgba(16,185,129,0.12); color: #34D399; border: 1px solid rgba(16,185,129,0.2); }
.badge-closed { background: rgba(239,68,68,0.1);   color: #F87171; border: 1px solid rgba(239,68,68,0.2); }
.badge-vuln   { background: rgba(239,68,68,0.1);   color: #F87171; border: 1px solid rgba(239,68,68,0.2); cursor: pointer; }
.badge-vuln:hover { background: rgba(239,68,68,0.18); }
.badge-safe   { background: rgba(16,185,129,0.08); color: #6EE7B7; border: 1px solid rgba(16,185,129,0.15); }

/* CVE list */
.cve-list { border-top: 1px solid rgba(255,255,255,0.05); padding: 16px 22px; display: flex; flex-direction: column; gap: 10px; }
.cve-item { border-radius: 12px; padding: 14px 16px; border-left: 3px solid; }
.cve-critical { background: rgba(239,68,68,0.07);  border-color: #EF4444; }
.cve-high     { background: rgba(249,115,22,0.07); border-color: #F97316; }
.cve-medium   { background: rgba(234,179,8,0.07);  border-color: #EAB308; }
.cve-low      { background: rgba(16,185,129,0.07); border-color: #10B981; }
.cve-unknown  { background: rgba(100,116,139,0.07);border-color: #64748B; }
.cve-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.cve-id { font-size: 13px; font-weight: 700; color: #E2E8F0; font-family: 'JetBrains Mono', monospace; }
.cve-badge { padding: 3px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; letter-spacing: 0.04em; }
.sev-CRITICAL { background: rgba(239,68,68,0.2);  color: #FCA5A5; }
.sev-HIGH     { background: rgba(249,115,22,0.2); color: #FDBA74; }
.sev-MEDIUM   { background: rgba(234,179,8,0.2);  color: #FDE047; }
.sev-LOW      { background: rgba(16,185,129,0.2); color: #6EE7B7; }
.cve-desc { font-size: 13px; color: #94A3B8; line-height: 1.6; }

.empty-state {
    text-align: center; padding: 60px 20px;
    background: rgba(14,21,40,0.6); border: 1px solid rgba(255,255,255,0.06);
    border-radius: 16px;
}
.empty-state h3 { font-size: 20px; font-weight: 700; color: #E2E8F0; margin-bottom: 8px; }
.empty-state p { font-size: 14px; color: #475569; }
`;

const sevClass = { CRITICAL: "cve-critical", HIGH: "cve-high", MEDIUM: "cve-medium", LOW: "cve-low" };
const sevBadge = { CRITICAL: "sev-CRITICAL", HIGH: "sev-HIGH", MEDIUM: "sev-MEDIUM", LOW: "sev-LOW" };

function PortCard({ result }) {
    const [open, setOpen] = useState(false);
    const cves = result.cves || [];
    const hasCves = cves.length > 0;

    return (
        <div className="port-card">
            <div className="port-card-header" onClick={() => hasCves && setOpen(!open)}>
                <div className="port-left">
                    <div className="port-num">
                        <div className="port-num-label">port</div>
                        <div className="port-num-value">{result.port}</div>
                    </div>
                    <div>
                        <div className="port-service">{result.service || "unknown"}</div>
                        <div className="port-version">{result.version || "version unknown"}</div>
                    </div>
                </div>
                <div className="port-right">
                    <span className={`badge ${result.state === "open" ? "badge-open" : "badge-closed"}`}>
                        {result.state}
                    </span>
                    {hasCves ? (
                        <span className="badge badge-vuln">
                            {cves.length} vuln{cves.length > 1 ? "s" : ""} {open ? "▲" : "▼"}
                        </span>
                    ) : (
                        <span className="badge badge-safe">clean</span>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        style={{ overflow: "hidden" }}
                    >
                        <div className="cve-list">
                            {cves.map((cve, i) => (
                                <div key={i} className={`cve-item ${sevClass[cve.severity] || "cve-unknown"}`}>
                                    <div className="cve-top">
                                        <span className="cve-id">{cve.cveId}</span>
                                        <span className={`cve-badge ${sevBadge[cve.severity] || ""}`}>
                                            {cve.severity}
                                        </span>
                                    </div>
                                    <p className="cve-desc">{cve.description}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function Results() {
    const location = useLocation();
    const navigate = useNavigate();
    const results = location.state?.results || [];
    const target  = location.state?.target  || "Unknown";

    const openPorts  = results.filter(r => r.state === "open").length;
    const totalCves  = results.reduce((s, r) => s + (r.cves?.length || 0), 0);
    const criticals  = results.reduce((s, r) => s + (r.cves?.filter(c => c.severity === "CRITICAL").length || 0), 0);

    return (
        <>
            <style>{styles}</style>
            <Navbar />
            <div className="results-root">
                <div className="results-inner">

                    {/* Header */}
                    <div className="results-header">
                        <div>
                            <h1 className="results-title">Scan results</h1>
                            <div className="results-target">⌕ {target}</div>
                        </div>
                        <button className="results-back" onClick={() => navigate("/home")}>
                            ← New scan
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="results-stats">
                        {[
                            { label: "Ports scanned", value: results.length,  color: "#E2E8F0" },
                            { label: "Open ports",    value: openPorts,        color: "#34D399" },
                            { label: "Vulnerabilities", value: totalCves,      color: "#F87171" },
                            { label: "Critical",      value: criticals,        color: "#EF4444" },
                        ].map(({ label, value, color }) => (
                            <div key={label} className="stat-card">
                                <div className="stat-label">{label}</div>
                                <div className="stat-value" style={{ color }}>{value}</div>
                            </div>
                        ))}
                    </div>

                    {/* Results */}
                    {results.length === 0 ? (
                        <div className="empty-state">
                            <h3>No results found</h3>
                            <p>The target may be offline or all ports are filtered.</p>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            {results.map((result, i) => (
                                <PortCard key={i} result={result} />
                            ))}
                        </motion.div>
                    )}
                </div>
            </div>
        </>
    );
}

export default Results;