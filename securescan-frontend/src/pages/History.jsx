import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: #060B18; font-family: 'Inter', system-ui, sans-serif; -webkit-font-smoothing: antialiased; }

.hist-root { min-height: 100vh; background: #060B18; padding: 100px 24px 60px; }
.hist-inner { max-width: 900px; margin: 0 auto; }

.hist-header { margin-bottom: 28px; }
.hist-title { font-size: 30px; font-weight: 800; color: #F1F5F9; letter-spacing: -0.025em; }
.hist-sub { font-size: 14px; color: #475569; margin-top: 6px; }

/* Stats row */
.hist-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 12px; margin-bottom: 24px; }
.hstat {
    background: rgba(14,21,40,0.8); border: 1px solid rgba(255,255,255,0.06);
    border-radius: 14px; padding: 16px 18px;
}
.hstat-label { font-size: 11px; font-weight: 600; color: #475569; letter-spacing: 0.07em; text-transform: uppercase; margin-bottom: 6px; }
.hstat-value { font-size: 26px; font-weight: 800; letter-spacing: -0.02em; }

/* Search */
.hist-search-wrap { position: relative; margin-bottom: 24px; }
.hist-search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #334155; font-size: 15px; pointer-events: none; }
.hist-search {
    width: 100%; padding: 12px 14px 12px 40px;
    background: rgba(14,21,40,0.8); border: 1px solid rgba(255,255,255,0.07);
    border-radius: 12px; color: #E2E8F0; font-size: 14px;
    outline: none; font-family: inherit;
    transition: border-color 0.2s, box-shadow 0.2s;
}
.hist-search::placeholder { color: #1E293B; }
.hist-search:focus { border-color: rgba(0,229,255,0.25); box-shadow: 0 0 0 3px rgba(0,229,255,0.05); }

/* Scan group card */
.scan-group {
    background: rgba(14,21,40,0.7); border: 1px solid rgba(255,255,255,0.06);
    border-radius: 18px; margin-bottom: 16px; overflow: hidden;
    transition: border-color 0.2s;
}
.scan-group:hover { border-color: rgba(0,229,255,0.12); }
.scan-group-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; }
.scan-group-target { font-size: 16px; font-weight: 700; color: #00E5FF; font-family: 'JetBrains Mono', monospace; }
.scan-group-date { font-size: 12px; color: #334155; margin-top: 4px; }
.scan-group-badges { display: flex; gap: 6px; flex-wrap: wrap; justify-content: flex-end; }

.gbadge { padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: 600; }
.gbadge-neutral { background: rgba(255,255,255,0.05); color: #64748B; border: 1px solid rgba(255,255,255,0.07); }
.gbadge-green   { background: rgba(16,185,129,0.1);  color: #34D399;  border: 1px solid rgba(16,185,129,0.2); }
.gbadge-red     { background: rgba(239,68,68,0.1);   color: #F87171;  border: 1px solid rgba(239,68,68,0.2); }

/* Port rows inside group */
.scan-group-ports { border-top: 1px solid rgba(255,255,255,0.05); padding: 12px 24px 16px; display: flex; flex-direction: column; gap: 8px; }

.port-row {
    display: flex; align-items: flex-start; justify-content: space-between;
    padding: 12px 16px; border-radius: 12px;
    background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05);
    transition: border-color 0.2s;
}
.port-row:hover { border-color: rgba(255,255,255,0.1); }
.port-row-left { display: flex; align-items: center; gap: 14px; }
.port-box {
    background: rgba(0,229,255,0.05); border: 1px solid rgba(0,229,255,0.12);
    border-radius: 8px; padding: 6px 10px; text-align: center; min-width: 58px;
}
.port-box-label { font-size: 9px; color: #334155; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; }
.port-box-num { font-size: 16px; font-weight: 800; color: #00E5FF; font-family: 'JetBrains Mono', monospace; line-height: 1.2; }
.port-info-name { font-size: 14px; font-weight: 600; color: #CBD5E1; }
.port-info-ver { font-size: 11px; color: #334155; font-family: 'JetBrains Mono', monospace; margin-top: 2px; }
.port-row-right { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; justify-content: flex-end; }

.pbadge { padding: 3px 10px; border-radius: 999px; font-size: 11px; font-weight: 600; }
.pbadge-open   { background: rgba(16,185,129,0.1); color: #34D399; border: 1px solid rgba(16,185,129,0.2); }
.pbadge-closed { background: rgba(239,68,68,0.08); color: #F87171; border: 1px solid rgba(239,68,68,0.15); }
.pbadge-vuln   { background: rgba(239,68,68,0.1);  color: #F87171; border: 1px solid rgba(239,68,68,0.2); cursor: pointer; }
.pbadge-clean  { background: rgba(16,185,129,0.07);color: #6EE7B7; border: 1px solid rgba(16,185,129,0.12); }

/* CVE inline */
.vuln-list { margin-top: 10px; display: flex; flex-direction: column; gap: 6px; width: 100%; }
.vuln-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; padding: 10px 12px; border-radius: 8px; border-left: 2px solid; }
.vr-CRITICAL { background: rgba(239,68,68,0.06); border-color: #EF4444; }
.vr-HIGH     { background: rgba(249,115,22,0.06); border-color: #F97316; }
.vr-MEDIUM   { background: rgba(234,179,8,0.06);  border-color: #EAB308; }
.vr-LOW      { background: rgba(16,185,129,0.06); border-color: #10B981; }
.vuln-id { font-size: 12px; font-weight: 700; color: #E2E8F0; font-family: 'JetBrains Mono', monospace; }
.vuln-desc { font-size: 11px; color: #64748B; margin-top: 3px; line-height: 1.5; }
.vuln-sev { padding: 2px 8px; border-radius: 5px; font-size: 10px; font-weight: 700; white-space: nowrap; }
.vs-CRITICAL { background: rgba(239,68,68,0.2);  color: #FCA5A5; }
.vs-HIGH     { background: rgba(249,115,22,0.2); color: #FDBA74; }
.vs-MEDIUM   { background: rgba(234,179,8,0.2);  color: #FDE047; }
.vs-LOW      { background: rgba(16,185,129,0.2); color: #6EE7B7; }

.hist-empty { text-align: center; padding: 70px 20px; background: rgba(14,21,40,0.6); border: 1px solid rgba(255,255,255,0.06); border-radius: 18px; }
.hist-empty h3 { font-size: 20px; font-weight: 700; color: #E2E8F0; margin-bottom: 8px; }
.hist-empty p { font-size: 14px; color: #475569; }

.hist-loading { text-align: center; padding: 60px; color: #334155; font-size: 14px; }
`;

function groupScans(list) {
    const groups = {};
    list.forEach(item => {
        const date = new Date(item.scanDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
        const key = `${item.target}__${date}`;
        if (!groups[key]) groups[key] = { target: item.target, date, ports: [] };
        groups[key].ports.push(item);
    });
    return Object.values(groups).sort((a, b) => new Date(b.ports[0].scanDate) - new Date(a.ports[0].scanDate));
}

function PortRowItem({ item }) {
    const [open, setOpen] = useState(false);
    const vulns = item.vulnerabilities ?? [];
    return (
        <div>
            <div className="port-row">
                <div className="port-row-left">
                    <div className="port-box">
                        <div className="port-box-label">port</div>
                        <div className="port-box-num">{item.port}</div>
                    </div>
                    <div>
                        <div className="port-info-name">{item.service}</div>
                        <div className="port-info-ver">{item.version || "version unknown"}</div>
                    </div>
                </div>
                <div className="port-row-right">
                    <span className={`pbadge ${item.state === "open" ? "pbadge-open" : "pbadge-closed"}`}>
                        {item.state}
                    </span>
                    {vulns.length > 0 ? (
                        <span className="pbadge pbadge-vuln" onClick={() => setOpen(!open)}>
                            {vulns.length} vuln{vulns.length > 1 ? "s" : ""} {open ? "▲" : "▼"}
                        </span>
                    ) : (
                        <span className="pbadge pbadge-clean">clean</span>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {open && vulns.length > 0 && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        style={{ overflow: "hidden", paddingLeft: 16 }}
                    >
                        <div className="vuln-list">
                            {vulns.map((v, i) => (
                                <div key={i} className={`vuln-row vr-${v.severity || "LOW"}`}>
                                    <div>
                                        <div className="vuln-id">{v.cveId}</div>
                                        <div className="vuln-desc">{v.description}</div>
                                    </div>
                                    <span className={`vuln-sev vs-${v.severity}`}>{v.severity}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function ScanGroup({ group, index }) {
    const totalVulns = group.ports.reduce((s, p) => s + (p.vulnerabilities?.length ?? 0), 0);
    const openCount  = group.ports.filter(p => p.state === "open").length;

    return (
        <motion.div
            className="scan-group"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
        >
            <div className="scan-group-header">
                <div>
                    <div className="scan-group-target">{group.target}</div>
                    <div className="scan-group-date">{group.date}</div>
                </div>
                <div className="scan-group-badges">
                    <span className="gbadge gbadge-neutral">{group.ports.length} port{group.ports.length !== 1 ? "s" : ""}</span>
                    <span className="gbadge gbadge-green">{openCount} open</span>
                    {totalVulns > 0 && <span className="gbadge gbadge-red">{totalVulns} vuln{totalVulns !== 1 ? "s" : ""}</span>}
                </div>
            </div>
            <div className="scan-group-ports">
                {group.ports.map(item => <PortRowItem key={item.id} item={item} />)}
            </div>
        </motion.div>
    );
}

function History() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        (async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get("http://localhost:8080/scan/history", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = res.data;
                setHistory(Array.isArray(data) ? data : data.content ?? data.data ?? []);
            } catch (e) {
                console.error("Failed to fetch history:", e);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const filtered = history.filter(s => s.target?.toLowerCase().includes(search.toLowerCase()));
    const groups   = groupScans(filtered);
    const openCount = history.filter(i => i.state === "open").length;
    const targets   = new Set(history.map(i => i.target)).size;
    const vulnCount = history.reduce((s, i) => s + (i.vulnerabilities?.length ?? 0), 0);

    return (
        <>
            <style>{styles}</style>
            <Navbar />
            <div className="hist-root">
                <div className="hist-inner">

                    <div className="hist-header">
                        <h1 className="hist-title">Scan history</h1>
                        <p className="hist-sub">Review and track previous vulnerability scans</p>
                    </div>

                    <div className="hist-stats">
                        {[
                            { label: "Total records",    value: history.length, color: "#E2E8F0" },
                            { label: "Targets scanned",  value: targets,        color: "#00E5FF" },
                            { label: "Open ports",       value: openCount,      color: "#34D399" },
                            { label: "Vulnerabilities",  value: vulnCount,      color: "#F87171" },
                        ].map(({ label, value, color }) => (
                            <div key={label} className="hstat">
                                <div className="hstat-label">{label}</div>
                                <div className="hstat-value" style={{ color }}>{value}</div>
                            </div>
                        ))}
                    </div>

                    <div className="hist-search-wrap">
                        <span className="hist-search-icon">⌕</span>
                        <input
                            className="hist-search"
                            type="text"
                            placeholder="Filter by IP or hostname..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>

                    {loading && <div className="hist-loading">Loading history...</div>}

                    {!loading && groups.length === 0 && (
                        <div className="hist-empty">
                            <h3>{search ? "No results match your filter" : "No scan history yet"}</h3>
                            <p>{search ? "Try a different search term." : "Run your first scan to see results here."}</p>
                        </div>
                    )}

                    <div>
                        {groups.map((group, i) => (
                            <ScanGroup key={i} group={group} index={i} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default History;