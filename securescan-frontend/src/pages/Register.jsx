import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import logo from "../assets/logo.webp";

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
            [{ x: canvas.width * 0.8, y: canvas.height * 0.2, r: 300, c: "rgba(139,92,246,0.05)" },
                { x: canvas.width * 0.2, y: canvas.height * 0.8, r: 280, c: "rgba(0,229,255,0.05)" }]
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
                if (d < 120) { ctx.strokeStyle = `rgba(139,92,246,${(1 - d / 120) * 0.15})`; ctx.lineWidth = 0.5; ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke(); }
            }
            pts.forEach(p => { ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = "rgba(139,92,246,0.5)"; ctx.fill(); });
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
    width: 100%; max-width: 420px;
    background: rgba(14, 21, 40, 0.85);
    border: 1px solid rgba(139,92,246,0.12);
    border-radius: 20px; padding: 40px 36px;
    backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
    box-shadow: 0 0 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(139,92,246,0.05);
}
.auth-logo { display: flex; flex-direction: column; align-items: center; gap: 12px; margin-bottom: 32px; }
.auth-logo img { width: 48px; height: 48px; border-radius: 12px; }
.auth-logo-name { font-size: 22px; font-weight: 700; color: #E2E8F0; letter-spacing: -0.02em; }
.auth-logo-sub { font-size: 13px; color: #475569; margin-top: 2px; }
.auth-field { margin-bottom: 16px; }
.auth-label { display: block; font-size: 12px; font-weight: 600; color: #64748B; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 8px; }
.auth-input {
    width: 100%; padding: 11px 14px;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
    border-radius: 10px; color: #E2E8F0; font-size: 14px; outline: none;
    transition: border-color 0.2s, box-shadow 0.2s; font-family: inherit;
}
.auth-input::placeholder { color: #334155; }
.auth-input:focus { border-color: rgba(139,92,246,0.4); box-shadow: 0 0 0 3px rgba(139,92,246,0.07); }
.auth-btn-primary {
    width: 100%; padding: 12px; margin-top: 8px;
    background: linear-gradient(135deg, #7C3AED, #00B4D8);
    border: none; border-radius: 10px;
    color: #fff; font-size: 15px; font-weight: 600;
    cursor: pointer; transition: opacity 0.2s, transform 0.15s; font-family: inherit;
}
.auth-btn-primary:hover { opacity: 0.88; transform: translateY(-1px); }
.auth-footer { text-align: center; font-size: 13px; color: #475569; margin-top: 24px; }
.auth-footer a { color: #A78BFA; text-decoration: none; font-weight: 500; }
.auth-footer a:hover { color: #C4B5FD; }
.auth-strength { margin-top: 6px; display: flex; gap: 4px; }
.auth-strength-bar { flex: 1; height: 3px; border-radius: 2px; background: rgba(255,255,255,0.08); transition: background 0.3s; }
.auth-strength-bar.filled-weak   { background: #EF4444; }
.auth-strength-bar.filled-medium { background: #F59E0B; }
.auth-strength-bar.filled-strong { background: #10B981; }
`;

function getStrength(pw) {
    if (!pw) return 0;
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
}

function Register() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const strength = getStrength(password);

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await api.post("/auth/register", {
                name,
                email,
                password
            });
        } catch (error) {
            console.error(error);
            alert("Registration failed — please try again.");
        } finally {
            setLoading(false);
        }
    };

    const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
    const strengthClass = strength <= 1 ? "filled-weak" : strength === 2 ? "filled-medium" : "filled-strong";

    return (
        <>
            <style>{styles}</style>
            <AnimatedBg />
            <div className="auth-root">
                <div className="auth-card">
                    <div className="auth-logo">
                        <img src={logo} alt="SecureScan" />
                        <div>
                            <div className="auth-logo-name">Create account</div>
                            <div className="auth-logo-sub">Join SecureScan — it's free</div>
                        </div>
                    </div>

                    <form onSubmit={handleRegister}>
                        <div className="auth-field">
                            <label className="auth-label">Full name</label>
                            <input type="text" placeholder="Your name" value={name}
                                   onChange={(e) => setName(e.target.value)}
                                   className="auth-input" required />
                        </div>
                        <div className="auth-field">
                            <label className="auth-label">Email</label>
                            <input type="email" placeholder="you@example.com" value={email}
                                   onChange={(e) => setEmail(e.target.value)}
                                   className="auth-input" required />
                        </div>
                        <div className="auth-field">
                            <label className="auth-label">Password</label>
                            <input type="password" placeholder="Min. 8 characters" value={password}
                                   onChange={(e) => setPassword(e.target.value)}
                                   className="auth-input" required />
                            {password && (
                                <>
                                    <div className="auth-strength">
                                        {[1,2,3,4].map(i => (
                                            <div key={i} className={`auth-strength-bar ${i <= strength ? strengthClass : ""}`} />
                                        ))}
                                    </div>
                                    <p style={{ fontSize: 11, color: "#64748B", marginTop: 4 }}>
                                        Password strength: <span style={{ color: strength <= 1 ? "#EF4444" : strength === 2 ? "#F59E0B" : "#10B981" }}>{strengthLabel}</span>
                                    </p>
                                </>
                            )}
                        </div>

                        <button type="submit" className="auth-btn-primary" disabled={loading}>
                            {loading ? "Creating account..." : "Create account"}
                        </button>
                    </form>

                    <div className="auth-footer">
                        Already have an account? <Link to="/login">Sign in</Link>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Register;