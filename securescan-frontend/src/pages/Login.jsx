import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import logo from "../assets/logo.webp";

/* ── Shared animated canvas background ───────────────────────────── */
function AnimatedBg() {
    const ref = useRef(null);
    useEffect(() => {
        const canvas = ref.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
        resize();
        window.addEventListener("resize", resize);
        const pts = Array.from({ length: 50 }, () => ({
            x: Math.random() * canvas.width, y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35, r: Math.random() * 1.5 + 0.5,
        }));
        let raf;
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            [{ x: canvas.width * 0.1, y: canvas.height * 0.2, r: 280, c: "rgba(0,229,255,0.05)" },
                { x: canvas.width * 0.9, y: canvas.height * 0.7, r: 320, c: "rgba(139,92,246,0.05)" }]
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
                if (d < 120) { ctx.strokeStyle = `rgba(0,229,255,${(1 - d / 120) * 0.15})`; ctx.lineWidth = 0.5; ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke(); }
            }
            pts.forEach(p => { ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = "rgba(0,229,255,0.45)"; ctx.fill(); });
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

.auth-root { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; position: relative; }
.auth-card {
    position: relative; z-index: 1;
    width: 100%; max-width: 400px;
    background: rgba(14, 21, 40, 0.85);
    border: 1px solid rgba(0,229,255,0.1);
    border-radius: 20px;
    padding: 40px 36px;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    box-shadow: 0 0 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,229,255,0.05);
}
.auth-logo { display: flex; flex-direction: column; align-items: center; gap: 12px; margin-bottom: 32px; }
.auth-logo img { width: 48px; height: 48px; border-radius: 12px; }
.auth-logo-name { font-size: 22px; font-weight: 700; color: #E2E8F0; letter-spacing: -0.02em; }
.auth-logo-sub { font-size: 13px; color: #475569; margin-top: 2px; }

.auth-field { margin-bottom: 16px; }
.auth-label { display: block; font-size: 12px; font-weight: 600; color: #64748B; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 8px; }
.auth-input {
    width: 100%; padding: 11px 14px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 10px;
    color: #E2E8F0; font-size: 14px;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    font-family: inherit;
}
.auth-input::placeholder { color: #334155; }
.auth-input:focus { border-color: rgba(0,229,255,0.35); box-shadow: 0 0 0 3px rgba(0,229,255,0.06); }
.auth-input.error { border-color: rgba(239,68,68,0.5); }

.auth-error {
    margin-bottom: 16px;
    padding: 10px 14px;
    background: rgba(239,68,68,0.08);
    border: 1px solid rgba(239,68,68,0.25);
    border-radius: 10px;
    font-size: 13px; color: #FCA5A5;
}

.auth-btn-primary {
    width: 100%; padding: 12px;
    background: linear-gradient(135deg, #00B4D8, #7C3AED);
    border: none; border-radius: 10px;
    color: #fff; font-size: 15px; font-weight: 600;
    cursor: pointer; transition: opacity 0.2s, transform 0.15s;
    font-family: inherit;
    margin-top: 8px;
}
.auth-btn-primary:hover { opacity: 0.88; transform: translateY(-1px); }
.auth-btn-primary:active { transform: translateY(0); }

.auth-divider { display: flex; align-items: center; gap: 12px; margin: 20px 0; }
.auth-divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.06); }
.auth-divider-text { font-size: 12px; color: #334155; }

.auth-oauth { display: flex; gap: 10px; margin-bottom: 24px; }
.auth-oauth-btn {
    flex: 1; display: flex; align-items: center; justify-content: center; gap-8px;
    gap: 8px;
    padding: 10px;
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.03);
    color: #94A3B8; font-size: 13px; font-weight: 500;
    text-decoration: none;
    transition: border-color 0.2s, background 0.2s, color 0.2s;
    font-family: inherit;
}
.auth-oauth-btn:hover { border-color: rgba(255,255,255,0.15); background: rgba(255,255,255,0.06); color: #E2E8F0; }
.auth-oauth-btn img { width: 16px; height: 16px; }

.auth-footer { text-align: center; font-size: 13px; color: #475569; }
.auth-footer a { color: #00E5FF; text-decoration: none; font-weight: 500; }
.auth-footer a:hover { color: #67E8F9; }
`;

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await api.post(
                "/auth/login",
                { email, password }
            );
            localStorage.setItem("token", response.data);
            setError(""); setEmail(""); setPassword("");
            alert("Login successful");
            navigate("/home");
        } catch (err) {
            setError(err.response?.data?.error || err.response?.data?.message || "Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{styles}</style>
            <AnimatedBg />
            <div className="auth-root">
                <div className="auth-card">
                    <div className="auth-logo">
                        <img src={logo} alt="SecureScan" />
                        <div>
                            <div className="auth-logo-name">SecureScan</div>
                            <div className="auth-logo-sub">Sign in to your account</div>
                        </div>
                    </div>

                    <form onSubmit={handleLogin}>
                        <div className="auth-field">
                            <label className="auth-label">Email</label>
                            <input
                                type="email" placeholder="you@example.com"
                                value={email} onChange={(e) => setEmail(e.target.value)}
                                className={`auth-input ${error ? "error" : ""}`}
                                required
                            />
                        </div>
                        <div className="auth-field">
                            <label className="auth-label">Password</label>
                            <input
                                type="password" placeholder="••••••••"
                                value={password} onChange={(e) => setPassword(e.target.value)}
                                className={`auth-input ${error ? "error" : ""}`}
                                required
                            />
                        </div>

                        {error && <div className="auth-error">{error}</div>}

                        <button type="submit" className="auth-btn-primary" disabled={loading}>
                            {loading ? "Signing in..." : "Sign in"}
                        </button>
                    </form>

                    <div className="auth-divider">
                        <div className="auth-divider-line" />
                        <span className="auth-divider-text">or continue with</span>
                        <div className="auth-divider-line" />
                    </div>

                    <div className="auth-oauth">
                        <a href="http://localhost:8080/oauth2/authorization/google" className="auth-oauth-btn">
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" />
                            Google
                        </a>
                        <a href="http://localhost:8080/oauth2/authorization/github" className="auth-oauth-btn">
                            <img src="https://www.svgrepo.com/show/512317/github-142.svg" alt="GitHub" />
                            GitHub
                        </a>
                    </div>

                    <div className="auth-footer">
                        Don't have an account? <Link to="/register">Create one</Link>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;