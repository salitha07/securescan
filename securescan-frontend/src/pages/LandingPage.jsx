import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import logo from "../assets/logo.webp";

function AnimatedBackground() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        // Particles for network nodes
        const particles = Array.from({ length: 60 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            r: Math.random() * 1.5 + 0.5,
        }));

        let frame;
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Ambient orbs
            const orbs = [
                { x: canvas.width * 0.15, y: canvas.height * 0.3, r: 300, color: "rgba(0, 229, 255, 0.055)" },
                { x: canvas.width * 0.85, y: canvas.height * 0.6, r: 350, color: "rgba(139, 92, 246, 0.055)" },
                { x: canvas.width * 0.5, y: canvas.height * 0.9, r: 250, color: "rgba(0, 229, 255, 0.04)" },
            ];
            orbs.forEach(({ x, y, r, color }) => {
                const g = ctx.createRadialGradient(x, y, 0, x, y, r);
                g.addColorStop(0, color);
                g.addColorStop(1, "transparent");
                ctx.fillStyle = g;
                ctx.beginPath();
                ctx.arc(x, y, r, 0, Math.PI * 2);
                ctx.fill();
            });

            // Move particles
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;
            });

            // Draw connections
            const maxDist = 130;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < maxDist) {
                        const alpha = (1 - dist / maxDist) * 0.18;
                        ctx.strokeStyle = `rgba(0, 229, 255, ${alpha})`;
                        ctx.lineWidth = 0.6;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            // Draw nodes
            particles.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(0, 229, 255, 0.5)";
                ctx.fill();
            });

            frame = requestAnimationFrame(draw);
        };
        draw();

        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("resize", resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 0,
                pointerEvents: "none",
            }}
        />
    );
}

const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
        background: #060B18;
        color: #E2E8F0;
        font-family: 'Inter', system-ui, sans-serif;
        -webkit-font-smoothing: antialiased;
    }

    .landing-root {
        position: relative;
        min-height: 100vh;
        overflow-x: hidden;
    }

    .content-layer {
        position: relative;
        z-index: 1;
    }

    /* NAV */
    .nav {
        position: sticky;
        top: 0;
        z-index: 100;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 48px;
        background: rgba(6, 11, 24, 0.7);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border-bottom: 1px solid rgba(0, 229, 255, 0.08);
    }

    .nav-brand {
        display: flex;
        align-items: center;
        gap: 10px;
        text-decoration: none;
    }

    .nav-brand img {
        width: 32px;
        height: 32px;
        border-radius: 8px;
    }

    .nav-brand-name {
        font-size: 18px;
        font-weight: 700;
        color: #E2E8F0;
        letter-spacing: -0.02em;
    }

    .nav-actions {
        display: flex;
        gap: 12px;
        align-items: center;
    }

    .btn-ghost {
        padding: 8px 20px;
        border-radius: 8px;
        border: 1px solid rgba(255,255,255,0.12);
        background: transparent;
        color: #CBD5E1;
        font-size: 14px;
        font-weight: 500;
        text-decoration: none;
        transition: border-color 0.2s, color 0.2s, background 0.2s;
    }
    .btn-ghost:hover {
        border-color: rgba(0, 229, 255, 0.4);
        color: #00E5FF;
        background: rgba(0, 229, 255, 0.05);
    }

    .btn-primary {
        padding: 8px 20px;
        border-radius: 8px;
        border: none;
        background: linear-gradient(135deg, #00B4D8, #7C3AED);
        color: #fff;
        font-size: 14px;
        font-weight: 600;
        text-decoration: none;
        transition: opacity 0.2s, transform 0.15s;
    }
    .btn-primary:hover {
        opacity: 0.88;
        transform: translateY(-1px);
    }

    .btn-primary-lg {
        padding: 14px 36px;
        border-radius: 10px;
        border: none;
        background: linear-gradient(135deg, #00B4D8, #7C3AED);
        color: #fff;
        font-size: 16px;
        font-weight: 600;
        text-decoration: none;
        transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
        box-shadow: 0 0 28px rgba(0, 180, 216, 0.25);
    }
    .btn-primary-lg:hover {
        opacity: 0.88;
        transform: translateY(-2px);
        box-shadow: 0 4px 40px rgba(0, 180, 216, 0.4);
    }

    .btn-ghost-lg {
        padding: 14px 36px;
        border-radius: 10px;
        border: 1px solid rgba(255,255,255,0.14);
        background: transparent;
        color: #CBD5E1;
        font-size: 16px;
        font-weight: 500;
        text-decoration: none;
        transition: border-color 0.2s, color 0.2s, background 0.2s;
    }
    .btn-ghost-lg:hover {
        border-color: rgba(0, 229, 255, 0.4);
        color: #00E5FF;
        background: rgba(0, 229, 255, 0.05);
    }

    /* HERO */
    .hero {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 100px 24px 80px;
        max-width: 860px;
        margin: 0 auto;
    }

    .hero-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 5px 14px;
        border-radius: 999px;
        border: 1px solid rgba(0, 229, 255, 0.25);
        background: rgba(0, 229, 255, 0.06);
        color: #00E5FF;
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        margin-bottom: 28px;
    }

    .hero-badge-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #00E5FF;
        animation: pulse 2s ease-in-out infinite;
    }

    @keyframes pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.4; transform: scale(0.8); }
    }

    .hero-title {
        font-size: clamp(44px, 7vw, 76px);
        font-weight: 800;
        letter-spacing: -0.03em;
        line-height: 1.05;
        margin-bottom: 24px;
        color: #F1F5F9;
    }

    .hero-title-accent {
        background: linear-gradient(135deg, #00E5FF 0%, #8B5CF6 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .hero-sub {
        font-size: 18px;
        color: #94A3B8;
        line-height: 1.7;
        max-width: 560px;
        margin-bottom: 44px;
        font-weight: 400;
    }

    .hero-ctas {
        display: flex;
        gap: 14px;
        flex-wrap: wrap;
        justify-content: center;
    }

    /* SCAN DEMO BAR */
    .scan-demo {
        max-width: 640px;
        margin: 60px auto 0;
        background: rgba(14, 21, 40, 0.8);
        border: 1px solid rgba(0, 229, 255, 0.15);
        border-radius: 14px;
        overflow: hidden;
        backdrop-filter: blur(12px);
    }

    .scan-demo-bar {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 18px;
        border-bottom: 1px solid rgba(255,255,255,0.06);
    }

    .dot { width: 10px; height: 10px; border-radius: 50%; }
    .dot-red { background: #FF5F57; }
    .dot-yellow { background: #FEBC2E; }
    .dot-green { background: #28C840; }

    .scan-demo-content {
        padding: 20px 22px;
        font-family: 'JetBrains Mono', 'Fira Mono', monospace;
        font-size: 13px;
        line-height: 1.9;
    }

    .c-dim { color: #475569; }
    .c-cyan { color: #00E5FF; }
    .c-green { color: #4ADE80; }
    .c-purple { color: #A78BFA; }
    .c-yellow { color: #FCD34D; }
    .c-white { color: #E2E8F0; }

    .cursor {
        display: inline-block;
        width: 8px;
        height: 14px;
        background: #00E5FF;
        vertical-align: middle;
        animation: blink 1.1s step-end infinite;
    }

    @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
    }

    /* SECTION */
    .section {
        max-width: 1100px;
        margin: 0 auto;
        padding: 100px 24px;
    }

    .section-eyebrow {
        display: block;
        text-align: center;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: #00E5FF;
        margin-bottom: 14px;
    }

    .section-title {
        text-align: center;
        font-size: clamp(28px, 4vw, 42px);
        font-weight: 700;
        letter-spacing: -0.025em;
        color: #F1F5F9;
        margin-bottom: 60px;
    }

    /* FEATURES */
    .features-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
    }

    .feature-card {
        background: rgba(14, 21, 40, 0.6);
        border: 1px solid rgba(255,255,255,0.07);
        border-radius: 16px;
        padding: 32px;
        transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
        backdrop-filter: blur(8px);
    }

    .feature-card:hover {
        border-color: rgba(0, 229, 255, 0.25);
        transform: translateY(-4px);
        box-shadow: 0 12px 40px rgba(0, 229, 255, 0.07);
    }

    .feature-icon {
        width: 46px;
        height: 46px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 22px;
        margin-bottom: 20px;
    }

    .icon-cyan { background: rgba(0, 229, 255, 0.1); }
    .icon-purple { background: rgba(139, 92, 246, 0.1); }
    .icon-blue { background: rgba(59, 130, 246, 0.1); }

    .feature-title {
        font-size: 17px;
        font-weight: 650;
        color: #F1F5F9;
        margin-bottom: 10px;
        letter-spacing: -0.01em;
    }

    .feature-desc {
        font-size: 14px;
        color: #64748B;
        line-height: 1.7;
    }

    /* STEPS */
    .steps-row {
        display: flex;
        gap: 0;
        align-items: stretch;
        position: relative;
    }

    .step-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding: 32px 20px;
        position: relative;
    }

    .step-item:not(:last-child)::after {
        content: '';
        position: absolute;
        top: 44px;
        right: 0;
        width: 50%;
        height: 1px;
        background: linear-gradient(90deg, rgba(0, 229, 255, 0.3), transparent);
    }

    .step-item:not(:first-child)::before {
        content: '';
        position: absolute;
        top: 44px;
        left: 0;
        width: 50%;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(0, 229, 255, 0.3));
    }

    .step-num {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        border: 1px solid rgba(0, 229, 255, 0.35);
        background: rgba(0, 229, 255, 0.06);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: 700;
        color: #00E5FF;
        margin-bottom: 16px;
        position: relative;
        z-index: 1;
    }

    .step-label {
        font-size: 14px;
        font-weight: 500;
        color: #94A3B8;
    }

    /* CTA */
    .cta-section {
        text-align: center;
        padding: 80px 24px 120px;
        max-width: 700px;
        margin: 0 auto;
    }

    .cta-title {
        font-size: clamp(32px, 5vw, 52px);
        font-weight: 800;
        letter-spacing: -0.03em;
        line-height: 1.1;
        color: #F1F5F9;
        margin-bottom: 18px;
    }

    .cta-sub {
        font-size: 16px;
        color: #64748B;
        margin-bottom: 40px;
        line-height: 1.6;
    }

    /* FOOTER */
    .footer {
        border-top: 1px solid rgba(255,255,255,0.06);
        padding: 28px 48px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .footer-left {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        font-weight: 600;
        color: #E2E8F0;
    }

    .footer-left img {
        width: 22px;
        height: 22px;
        border-radius: 6px;
        opacity: 0.8;
    }

    .footer-right {
        font-size: 13px;
        color: #334155;
    }

    @media (max-width: 640px) {
        .nav { padding: 14px 20px; }
        .steps-row { flex-direction: column; gap: 8px; }
        .step-item::after, .step-item::before { display: none; }
        .footer { flex-direction: column; gap: 10px; text-align: center; }
    }
`;

function LandingPage() {
    return (
        <>
            <style>{styles}</style>
            <div className="landing-root">
                <AnimatedBackground />

                <div className="content-layer">
                    {/* Nav */}
                    <nav className="nav">
                        <Link to="/" className="nav-brand">
                            <img src={logo} alt="SecureScan" />
                            <span className="nav-brand-name">SecureScan</span>
                        </Link>
                        <div className="nav-actions">
                            <Link to="/login" className="btn-ghost">Login</Link>
                            <Link to="/register" className="btn-primary">Get Started</Link>
                        </div>
                    </nav>

                    {/* Hero */}
                    <section className="hero">
                        <div className="hero-badge">
                            <span className="hero-badge-dot" />
                            AI-Powered Security Platform
                        </div>

                        <h1 className="hero-title">
                            Find Vulnerabilities<br />
                            <span className="hero-title-accent">Before Attackers Do</span>
                        </h1>

                        <p className="hero-sub">
                            Automated port scanning, service detection, and vulnerability analysis — all in one platform built for modern security teams.
                        </p>

                        <div className="hero-ctas">
                            <Link to="/register" className="btn-primary-lg">Start Scanning Free</Link>
                            <Link to="/login" className="btn-ghost-lg">Sign In</Link>
                        </div>

                        {/* Terminal Demo */}
                        <div className="scan-demo">
                            <div className="scan-demo-bar">
                                <span className="dot dot-red" />
                                <span className="dot dot-yellow" />
                                <span className="dot dot-green" />
                            </div>
                            <div className="scan-demo-content">
                                <div><span className="c-dim">$</span> <span className="c-cyan">securescan</span> <span className="c-white">--target 192.168.1.1 --full</span></div>
                                <div><span className="c-dim">›</span> <span className="c-purple">Initializing scan engine...</span></div>
                                <div><span className="c-green">✓</span> <span className="c-white">Port 22</span> <span className="c-dim">— SSH (OpenSSH 8.4)</span></div>
                                <div><span className="c-green">✓</span> <span className="c-white">Port 80</span> <span className="c-dim">— HTTP (nginx 1.18)</span></div>
                                <div><span className="c-yellow">⚠</span> <span className="c-white">Port 443</span> <span className="c-dim">— TLS 1.0 detected</span> <span className="c-yellow">[CVE-2011-3389]</span></div>
                                <div><span className="c-dim">›</span> Analyzing 1,024 ports... <span className="cursor" /></div>
                            </div>
                        </div>
                    </section>

                    {/* Features */}
                    <section className="section">
                        <span className="section-eyebrow">What we offer</span>
                        <h2 className="section-title">Everything you need to stay secure</h2>

                        <div className="features-grid">
                            <div className="feature-card">
                                <div className="feature-icon icon-cyan">🔍</div>
                                <div className="feature-title">Port & Service Scanning</div>
                                <p className="feature-desc">Discover open ports and fingerprint running services across any IP range. Fast, accurate, and non-intrusive.</p>
                            </div>

                            <div className="feature-card">
                                <div className="feature-icon icon-purple">🛡️</div>
                                <div className="feature-title">Vulnerability Detection</div>
                                <p className="feature-desc">Match exposed services against a live CVE database to surface real, exploitable risks — not noise.</p>
                            </div>

                            <div className="feature-card">
                                <div className="feature-icon icon-blue">🤖</div>
                                <div className="feature-title">AI-Powered Analysis</div>
                                <p className="feature-desc">Our AI synthesizes scan results into prioritized, actionable reports — so you know what to fix first.</p>
                            </div>

                            <div className="feature-card">
                                <div className="feature-icon icon-cyan">📊</div>
                                <div className="feature-title">Scan History & Trends</div>
                                <p className="feature-desc">Track your security posture over time. See what was fixed, what regressed, and where risk is growing.</p>
                            </div>

                            <div className="feature-card">
                                <div className="feature-icon icon-purple">⚡</div>
                                <div className="feature-title">Instant Results</div>
                                <p className="feature-desc">Results stream in real time. No waiting for a report — watch the scan unfold as it happens.</p>
                            </div>

                            <div className="feature-card">
                                <div className="feature-icon icon-blue">🔒</div>
                                <div className="feature-title">Compliance Ready</div>
                                <p className="feature-desc">Export findings in formats suitable for SOC 2, PCI-DSS, and ISO 27001 audits right out of the box.</p>
                            </div>
                        </div>
                    </section>

                    {/* How it works */}
                    <section className="section" style={{ paddingTop: 0 }}>
                        <span className="section-eyebrow">The process</span>
                        <h2 className="section-title">Scan in four steps</h2>

                        <div className="steps-row">
                            {[
                                { n: "01", label: "Enter Target" },
                                { n: "02", label: "Scan Services" },
                                { n: "03", label: "Detect Risks" },
                                { n: "04", label: "View Report" },
                            ].map(({ n, label }) => (
                                <div key={n} className="step-item">
                                    <div className="step-num">{n}</div>
                                    <div className="step-label">{label}</div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* CTA */}
                    <div className="cta-section">
                        <h2 className="cta-title">
                            Your attack surface is<br />
                            <span className="hero-title-accent">larger than you think.</span>
                        </h2>
                        <p className="cta-sub">
                            Most breaches start with an exposed port nobody knew was open. SecureScan finds them first.
                        </p>
                        <Link to="/register" className="btn-primary-lg">
                            Start Your Free Scan
                        </Link>
                    </div>

                    {/* Footer */}
                    <footer className="footer">
                        <div className="footer-left">
                            <img src={logo} alt="" />
                            SecureScan
                        </div>
                        <div className="footer-right">
                            © 2026 SecureScan · Cybersecurity & Vulnerability Analysis
                        </div>
                    </footer>
                </div>
            </div>
        </>
    );
}

export default LandingPage;