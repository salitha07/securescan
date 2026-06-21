import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import bgImage from "../assets/bg2.jpg";

// ── Group flat list into { target, date, ports[] } ──────────────────────────
function groupScans(list) {
    const groups = {};

    list.forEach(item => {
        const date = new Date(item.scanDate).toLocaleDateString("en-US", {
            year: "numeric", month: "long", day: "numeric"
        });
        const key = `${item.target}__${date}`;

        if (!groups[key]) {
            groups[key] = { target: item.target, date, ports: [] };
        }
        groups[key].ports.push(item);
    });

    return Object.values(groups).sort(
        (a, b) => new Date(b.ports[0].scanDate) - new Date(a.ports[0].scanDate)
    );
}

// ── Single port row (expandable vulnerabilities) ─────────────────────────────
function PortRow({ item }) {
    const [open, setOpen] = useState(false);
    const vulns = item.vulnerabilities ?? [];

    const severityBorder = { CRITICAL: "border-red-500", HIGH: "border-orange-400", MEDIUM: "border-yellow-400" };
    const severityText   = { CRITICAL: "text-red-400",   HIGH: "text-orange-400",   MEDIUM: "text-yellow-400" };
    const severityBadge  = { CRITICAL: "bg-red-900/40 text-red-400", HIGH: "bg-orange-900/40 text-orange-400", MEDIUM: "bg-yellow-900/40 text-yellow-400" };

    return (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">

            {/* Row header */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">

                    {/* Port box */}
                    <div className="bg-black/30 rounded-lg px-3 py-2 text-center min-w-[64px]">
                        <p className="text-gray-400 text-xs">PORT</p>
                        <p className="text-white font-bold text-lg leading-tight">{item.port}</p>
                    </div>

                    {/* Service + version */}
                    <div>
                        <p className="text-white font-semibold">{item.service}</p>
                        <p className="text-gray-400 text-sm">{item.version || "Unknown version"}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* State badge */}
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        item.state === "open"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                    }`}>
                        {item.state}
                    </span>

                    {/* Vuln toggle — only shown if vulns exist */}
                    {vulns.length > 0 && (
                        <button
                            onClick={() => setOpen(!open)}
                            className="text-xs font-semibold px-3 py-1 rounded-full bg-red-900/30 text-red-400 hover:bg-red-900/50 transition"
                        >
                            {vulns.length} vuln{vulns.length > 1 ? "s" : ""} {open ? "▲" : "▼"}
                        </button>
                    )}
                </div>
            </div>

            {/* Vulnerabilities (expanded) */}
            {open && (
                <div className="mt-4 border-t border-white/10 pt-4 space-y-3">
                    {vulns.map((vuln, i) => (
                        <div
                            key={i}
                            className={`bg-red-950/20 rounded-xl p-4 border-l-4 ${severityBorder[vuln.severity] ?? "border-gray-500"}`}
                        >
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-white font-bold text-sm">{vuln.cveId}</span>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${severityBadge[vuln.severity] ?? "bg-gray-700 text-gray-300"}`}>
                                    {vuln.severity}
                                </span>
                            </div>
                            <p className={`text-xs font-semibold mb-1 ${severityText[vuln.severity] ?? "text-gray-400"}`}>
                                {vuln.severity}
                            </p>
                            <p className="text-gray-300 text-sm leading-relaxed">{vuln.description}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ── One scan group (target + date) ───────────────────────────────────────────
function ScanGroup({ group }) {
    const totalVulns = group.ports.reduce((sum, p) => sum + (p.vulnerabilities?.length ?? 0), 0);
    const openCount  = group.ports.filter(p => p.state === "open").length;

    return (
        <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-cyan-500/50 transition">

            {/* Group header */}
            <div className="flex justify-between items-start mb-5">
                <div>
                    <h2 className="text-2xl font-bold text-cyan-400">{group.target}</h2>
                    <p className="text-gray-400 text-sm mt-1">{group.date}</p>
                </div>

                <div className="flex gap-2 flex-wrap justify-end">
                    <span className="text-xs px-3 py-1 rounded-full bg-white/10 text-gray-300">
                        {group.ports.length} port{group.ports.length > 1 ? "s" : ""}
                    </span>
                    <span className="text-xs px-3 py-1 rounded-full bg-green-500/20 text-green-400">
                        {openCount} open
                    </span>
                    {totalVulns > 0 && (
                        <span className="text-xs px-3 py-1 rounded-full bg-red-500/20 text-red-400">
                            {totalVulns} vuln{totalVulns > 1 ? "s" : ""}
                        </span>
                    )}
                </div>
            </div>

            {/* Port rows */}
            <div className="space-y-3">
                {group.ports.map(item => (
                    <PortRow key={item.id} item={item} />
                ))}
            </div>
        </div>
    );
}

// ── Main page ────────────────────────────────────────────────────────────────
function History() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(
                    "http://localhost:8080/scan/history",
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                // ✅ Safely handle both plain array and wrapped responses
                const data = response.data;
                const arr = Array.isArray(data)
                    ? data
                    : data.content ?? data.data ?? [];

                console.log("First item:", arr[0]); // remove after confirming it works
                setHistory(arr);

            } catch (error) {
                console.error("Failed to fetch history:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    const filtered = history.filter(scan =>
        scan.target?.toLowerCase().includes(search.toLowerCase())
    );

    const groups = groupScans(filtered);

    return (
        <>
            <Navbar />

            <div
                className="min-h-screen bg-cover bg-center"
                style={{ backgroundImage: `url(${bgImage})` }}
            >
                <div className="min-h-screen bg-black/80 pt-24 px-6 pb-10">
                    <div className="max-w-4xl mx-auto">

                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-4xl font-bold text-white">Scan History</h1>
                            <p className="text-gray-400 mt-2">Review previous vulnerability scans</p>
                        </div>

                        {/* Stats */}
                        <div className="grid md:grid-cols-3 gap-6 mb-8">
                            {[
                                { label: "Total Records",   value: history.length,                                   color: "text-white"     },
                                { label: "Open Ports",      value: history.filter(i => i.state === "open").length,  color: "text-green-400" },
                                { label: "Targets Scanned", value: new Set(history.map(i => i.target)).size,        color: "text-cyan-400"  },
                            ].map(({ label, value, color }) => (
                                <div key={label} className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                                    <p className="text-gray-400">{label}</p>
                                    <h2 className={`text-3xl font-bold mt-2 ${color}`}>{value}</h2>
                                </div>
                            ))}
                        </div>

                        {/* Search */}
                        <div className="mb-8">
                            <input
                                type="text"
                                placeholder="Search by target IP or hostname..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                        </div>

                        {/* Loading */}
                        {loading && (
                            <div className="text-center text-white py-20">
                                Loading history...
                            </div>
                        )}

                        {/* Empty */}
                        {!loading && groups.length === 0 && (
                            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-10 text-center">
                                <h3 className="text-2xl font-semibold text-white">No Scan History</h3>
                                <p className="text-gray-400 mt-3">Perform your first scan to see results here.</p>
                            </div>
                        )}

                        {/* Grouped scan cards */}
                        <div className="space-y-6">
                            {groups.map((group, i) => (
                                <ScanGroup key={i} group={group} />
                            ))}
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}

export default History;