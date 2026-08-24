import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.webp";

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const isActive = (path) => location.pathname === path;

    return (
        <>
            <style>{`
                .ss-nav {
                    position: fixed;
                    top: 0; left: 0; right: 0;
                    z-index: 100;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 14px 40px;
                    background: rgba(6, 11, 24, 0.8);
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    border-bottom: 1px solid rgba(0, 229, 255, 0.08);
                }
                .ss-nav-brand {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    text-decoration: none;
                }
                .ss-nav-brand img {
                    width: 28px; height: 28px;
                    border-radius: 7px;
                }
                .ss-nav-brand-name {
                    font-size: 17px;
                    font-weight: 700;
                    color: #E2E8F0;
                    letter-spacing: -0.02em;
                }
                .ss-nav-links {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }
                .ss-nav-link {
                    padding: 7px 16px;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 500;
                    text-decoration: none;
                    color: #64748B;
                    transition: color 0.2s, background 0.2s;
                }
                .ss-nav-link:hover {
                    color: #E2E8F0;
                    background: rgba(255,255,255,0.05);
                }
                .ss-nav-link.active {
                    color: #00E5FF;
                    background: rgba(0,229,255,0.07);
                }
                .ss-nav-logout {
                    margin-left: 8px;
                    padding: 7px 16px;
                    border-radius: 8px;
                    border: 1px solid rgba(239,68,68,0.3);
                    background: rgba(239,68,68,0.06);
                    color: #F87171;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: background 0.2s, border-color 0.2s;
                }
                .ss-nav-logout:hover {
                    background: rgba(239,68,68,0.15);
                    border-color: rgba(239,68,68,0.5);
                }
            `}</style>

            <nav className="ss-nav">
                <Link to="/home" className="ss-nav-brand">
                    <img src={logo} alt="SecureScan" />
                    <span className="ss-nav-brand-name">SecureScan</span>
                </Link>

                <div className="ss-nav-links">
                    <Link
                        to="/home"
                        className={`ss-nav-link ${isActive("/home") ? "active" : ""}`}
                    >
                        Scanner
                    </Link>
                    <Link
                        to="/history"
                        className={`ss-nav-link ${isActive("/history") ? "active" : ""}`}
                    >
                        History
                    </Link>
                    <Link
                        to="/profile"
                        className={`ss-nav-link ${isActive("/profile") ? "active" : ""}`}
                    >
                        Profile
                    </Link>
                    <button onClick={handleLogout} className="ss-nav-logout">
                        Sign out
                    </button>
                </div>
            </nav>
        </>
    );
}

export default Navbar;
