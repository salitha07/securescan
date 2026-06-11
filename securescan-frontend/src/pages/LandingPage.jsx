import { Link } from "react-router-dom";
import bgImage from "../assets/homebg.jpg";
import logo from "../assets/logo.webp";

function LandingPage() {
    return (
        <div
            className="min-h-screen bg-cover bg-center text-white"
            style={{
                backgroundImage: `url(${bgImage})`
            }}
        >
            <div className="min-h-screen bg-black/70">

                {/* Navbar */}
                <nav className="flex justify-between items-center px-8 py-5 border-b border-white/10 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <img
                            src={logo}
                            alt="SecureScan"
                            className="w-10 h-10"
                        />

                        <h1 className="text-2xl font-bold">
                            SecureScan
                        </h1>
                    </div>

                    <div className="flex gap-4">
                        <Link
                            to="/login"
                            className="px-5 py-2 rounded-lg border border-white/20 hover:bg-white/10"
                        >
                            Login
                        </Link>

                        <Link
                            to="/register"
                            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700"
                        >
                            Get Started
                        </Link>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="flex flex-col items-center justify-center text-center px-6 py-28">

                    <img
                        src={logo}
                        alt="SecureScan"
                        className="w-32 h-32 mb-6"
                    />

                    <h1 className="text-6xl font-bold mb-6">
                        SecureScan
                    </h1>

                    <p className="text-xl text-gray-300 max-w-3xl mb-8">
                        AI-Powered Vulnerability Scanning Platform
                        for discovering open ports, detecting
                        running services, and identifying
                        potential security risks.
                    </p>

                    <div className="flex gap-4">
                        <Link
                            to="/register"
                            className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-lg text-lg font-semibold"
                        >
                            Start Scanning
                        </Link>

                        <Link
                            to="/login"
                            className="border border-white/20 hover:bg-white/10 px-8 py-4 rounded-lg text-lg"
                        >
                            Login
                        </Link>
                    </div>
                </section>

                {/* Features */}
                <section className="max-w-6xl mx-auto px-6 py-20">

                    <h2 className="text-4xl font-bold text-center mb-12">
                        Features
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8">

                        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl">
                            <div className="text-5xl mb-4">🔍</div>

                            <h3 className="text-2xl font-semibold mb-3">
                                Port Scanning
                            </h3>

                            <p className="text-gray-300">
                                Discover open ports and identify
                                services running on target systems.
                            </p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl">
                            <div className="text-5xl mb-4">🛡️</div>

                            <h3 className="text-2xl font-semibold mb-3">
                                Vulnerability Detection
                            </h3>

                            <p className="text-gray-300">
                                Detect known vulnerabilities and
                                security weaknesses in exposed services.
                            </p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl">
                            <div className="text-5xl mb-4">📊</div>

                            <h3 className="text-2xl font-semibold mb-3">
                                Scan History
                            </h3>

                            <p className="text-gray-300">
                                Keep track of previous scans and
                                monitor security improvements.
                            </p>
                        </div>

                    </div>
                </section>

                {/* How It Works */}
                <section className="max-w-6xl mx-auto px-6 py-20">

                    <h2 className="text-4xl font-bold text-center mb-12">
                        How It Works
                    </h2>

                    <div className="grid md:grid-cols-4 gap-8 text-center">

                        <div className="bg-white/10 p-6 rounded-xl">
                            <h3 className="text-xl font-semibold mb-2">
                                1
                            </h3>

                            <p>Enter Target</p>
                        </div>

                        <div className="bg-white/10 p-6 rounded-xl">
                            <h3 className="text-xl font-semibold mb-2">
                                2
                            </h3>

                            <p>Scan Services</p>
                        </div>

                        <div className="bg-white/10 p-6 rounded-xl">
                            <h3 className="text-xl font-semibold mb-2">
                                3
                            </h3>

                            <p>Detect Risks</p>
                        </div>

                        <div className="bg-white/10 p-6 rounded-xl">
                            <h3 className="text-xl font-semibold mb-2">
                                4
                            </h3>

                            <p>View Results</p>
                        </div>

                    </div>
                </section>

                {/* CTA */}
                <section className="text-center py-20 px-6">

                    <h2 className="text-5xl font-bold mb-6">
                        Ready to Secure Your Systems?
                    </h2>

                    <p className="text-gray-300 mb-8 text-lg">
                        Start scanning and uncover vulnerabilities today.
                    </p>

                    <Link
                        to="/register"
                        className="bg-blue-600 hover:bg-blue-700 px-10 py-4 rounded-lg text-lg font-semibold"
                    >
                        Get Started Now
                    </Link>

                </section>

                {/* Footer */}
                <footer className="border-t border-white/10 py-6 text-center text-gray-400">
                    © 2026 SecureScan • Cybersecurity & Vulnerability Analysis Platform
                </footer>

            </div>
        </div>
    );
}

export default LandingPage;