import { useState, useEffect, useRef } from "react";
import api from "../api";
import {Link, useNavigate} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import ScanProgress from "../components/ScanProgress";
import PingChecker from "../components/PingChecker";

function AnimatedBg() {
    const ref = useRef(null);
    useEffect(() => {
        const canvas = ref.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
        resize();
        window.addEventListener("resize", resize);
        const pts = Array.from({ length: 55 }, () => ({
            x: Math.random() * canvas.width, y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35, r: Math.random() * 1.5 + 0.5,
        }));
        let raf;
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            [{ x: canvas.width * 0.15, y: canvas.height * 0.3, r: 300, c: "rgba(0,229,255,0.055)" },
                { x: canvas.width * 0.85, y: canvas.height * 0.6, r: 350, c: "rgba(139,92,246,0.055)" }]
                .forEach(({ x, y, r, c }) => {
                    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
                    g.addColorStop(0, c); g.addColorStop(1, "transparent");
                    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
                });
            pts.forEach(p => {
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
            });
            for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
                const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
                const d = Math.sqrt(dx * dx + dy * dy);
                if (d < 130) { ctx.strokeStyle = `rgba(0,229,255,${(1 - d / 130) * 0.16})`; ctx.lineWidth = 0.6; ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke(); }
            }
            pts.forEach(p => { ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = "rgba(0,229,255,0.48)"; ctx.fill(); });
            raf = requestAnimationFrame(draw);
        };
        draw();
        return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
    }, []);
    return <canvas ref={ref} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }} />;
}

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: #060B18; font-family: 'Inter', system-ui, sans-serif; -webkit-font-smoothing: antialiased; }

.home-root { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 100px 24px 40px; position: relative; }

.scan-card {
    position: relative; z-index: 1;
    width: 100%; max-width: 580px;
    background: rgba(14, 21, 40, 0.8);
    border: 1px solid rgba(0,229,255,0.1);
    border-radius: 20px; padding: 40px;
    backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
    box-shadow: 0 0 80px rgba(0,0,0,0.4);
}

.scan-header { text-align: center; margin-bottom: 32px; }
.scan-badge {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 4px 12px; border-radius: 999px;
    border: 1px solid rgba(0,229,255,0.2);
    background: rgba(0,229,255,0.05);
    color: #00E5FF; font-size: 11px; font-weight: 600;
    letter-spacing: 0.08em; text-transform: uppercase;
    margin-bottom: 16px;
}
.scan-badge-dot { width: 6px; height: 6px; border-radius: 50%; background: #00E5FF; animation: pulse 2s ease-in-out infinite; }
@keyframes pulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.4; transform:scale(0.8); } }
.scan-title { font-size: 28px; font-weight: 800; color: #F1F5F9; letter-spacing: -0.025em; margin-bottom: 8px; }
.scan-sub { font-size: 14px; color: #475569; line-height: 1.6; }

.scan-input-wrap { position: relative; margin-bottom: 12px; }
.scan-input-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #334155; font-size: 16px; pointer-events: none; }
.scan-input {
    width: 100%; padding: 13px 14px 13px 40px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px; color: #E2E8F0; font-size: 15px;
    outline: none; transition: border-color 0.2s, box-shadow 0.2s;
    font-family: 'JetBrains Mono', 'Fira Mono', monospace;
}
.scan-input::placeholder { color: #1E293B; font-family: 'Inter', system-ui, sans-serif; }
.scan-input:focus { border-color: rgba(0,229,255,0.3); box-shadow: 0 0 0 3px rgba(0,229,255,0.06); }
.scan-input:disabled { opacity: 0.5; }

.scan-btn {
    width: 100%; padding: 13px;
    background: linear-gradient(135deg, #00B4D8, #7C3AED);
    border: none; border-radius: 12px;
    color: #fff; font-size: 15px; font-weight: 600;
    cursor: pointer; transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
    font-family: inherit; margin-top: 14px;
    box-shadow: 0 0 24px rgba(0,180,216,0.2);
}
.scan-btn:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); box-shadow: 0 4px 32px rgba(0,180,216,0.35); }
.scan-btn:disabled { opacity: 0.45; cursor: not-allowed; }

.scan-tips { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 16px; }
.scan-tip {
    padding: 4px 10px; border-radius: 6px;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06);
    color: #334155; font-size: 11px; font-family: 'JetBrains Mono', monospace;
    cursor: pointer; transition: border-color 0.2s, color 0.2s;
}
.scan-tip:hover { border-color: rgba(0,229,255,0.2); color: #00E5FF; }
`;

const EXAMPLE_TARGETS = ["scanme.nmap.org", "8.8.8.8", "example.com"];

function Home() {
    const [target, setTarget] = useState("");
    const [loading, setLoading] = useState(false);
    const [scanId, setScanId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) navigate("/login");
    }, [navigate]);

    const handleScan = async () => {
        const token = localStorage.getItem("token");
        if (!token) { navigate("/login"); return; }
        if (!target.trim()) return;
        try {
            setLoading(true);
            setScanId(null);
            const res = await api.post("/scan/start", {
                target
            });
            setScanId(res.data.scanId);
        } catch (error) {
            console.error(error);
            alert("Failed to start scan");
            setLoading(false);
        }
    };

    const handleScanComplete = async (completedScanId) => {
        try {
            const res = await api.get(
                `/scan/results/${completedScanId}`
            );
            navigate("/results", { state: { results: res.data, target } });
        } catch (error) {
            console.error(error);
            alert("Failed to fetch results");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{styles}</style>
            <AnimatedBg />
            <Navbar />
            <div className="home-root">
                <div className="scan-card">
                    <div className="scan-header">
                        {/* Back to landing */}
                        <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 20 }}>
                            <Link
                                to="/"
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 6,
                                    padding: "6px 14px",
                                    borderRadius: 8,
                                    border: "1px solid rgba(255,255,255,0.08)",
                                    background: "rgba(255,255,255,0.03)",
                                    color: "#475569",
                                    fontSize: 13,
                                    fontWeight: 500,
                                    textDecoration: "none",
                                    transition: "color 0.2s, border-color 0.2s",
                                }}
                                onMouseEnter={e => { e.currentTarget.style.color = "#E2E8F0"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; }}
                                onMouseLeave={e => { e.currentTarget.style.color = "#475569"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                            >
                                ← Landing page
                            </Link>
                        </div>
                        <div className="scan-badge">
                            <span className="scan-badge-dot" />
                            Scanner ready
                        </div>
                        <h1 className="scan-title">Scan a target</h1>
                        <p className="scan-sub">Enter an IP address or domain to detect open ports, services, and known vulnerabilities.</p>
                    </div>

                    <div className="scan-input-wrap">
                        <span className="scan-input-icon">⌕</span>
                        <input
                            className="scan-input"
                            type="text"
                            placeholder="192.168.1.1 or example.com"
                            value={target}
                            onChange={(e) => setTarget(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && !loading && handleScan()}
                            disabled={loading}
                        />
                    </div>

                    {/* Example targets */}
                    {!loading && (
                        <div className="scan-tips">
                            <span style={{ fontSize: 11, color: "#334155", alignSelf: "center" }}>Try:</span>
                            {EXAMPLE_TARGETS.map(t => (
                                <button key={t} className="scan-tip" onClick={() => setTarget(t)}>{t}</button>
                            ))}
                        </div>
                    )}

                    <PingChecker target={target} />

                    <AnimatePresence>
                        {scanId && loading && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                            >
                                <ScanProgress scanId={scanId} onComplete={handleScanComplete} />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button className="scan-btn" onClick={handleScan} disabled={loading}>
                        {loading ? "Scanning..." : "Start scan"}
                    </button>
                </div>
            </div>
        </>
    );
}

export default Home;