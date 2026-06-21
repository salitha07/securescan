import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

import { motion } from "framer-motion";

function Home() {

    const [target, setTarget] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleScan = async () => {

        const token = localStorage.getItem("token");

        if (!token) {
            alert("Please login first");
            navigate("/login");
            return;
        }

        if (!target) {
            alert("Enter IP or domain");
            return;
        }

        try {

            setLoading(true);

            const response = await axios.get(
                `http://localhost:8080/scan?target=${target}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            navigate("/results", {
                state: {
                    results: response.data,
                    target: target
                }
            });

        } catch (error) {

            console.error(error);
            alert("Scan failed");

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {

        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
        }

    }, [navigate]);

    return (
        <>
            <Navbar />

            <div
                className="min-h-screen bg-cover bg-center relative overflow-hidden bg-black"

            >

                {/* Animated Background Effects */}
                <motion.div
                    className="absolute w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"
                    animate={{
                        x: [0, 100, 0],
                        y: [0, -50, 0]
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                <motion.div
                    className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
                    animate={{
                        x: [0, -120, 0],
                        y: [0, 80, 0]
                    }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                <motion.div
                    className="min-h-screen bg-black/60 flex items-center justify-center px-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                >

                    <motion.div
                        className="bg-white/10 backdrop-blur-md p-10 rounded-2xl shadow-2xl w-full max-w-2xl text-white border border-white/20"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                    >

                        <motion.h1
                            className="text-5xl font-bold mb-6 text-center"
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{
                                duration: 0.6,
                                type: "spring"
                            }}
                        >
                            SecureScan
                        </motion.h1>

                        <motion.p
                            className="mb-8 text-gray-300 text-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            Scan networks, detect services, identify vulnerabilities,
                            and monitor security risks in real time.
                        </motion.p>

                        <motion.input
                            type="text"
                            placeholder="Enter IP address or domain"
                            value={target}
                            onChange={(e) => setTarget(e.target.value)}
                            whileFocus={{
                                scale: 1.02
                            }}
                            className="w-full p-4 rounded-lg bg-white/20 border border-white/20 text-white placeholder-gray-300 outline-none"
                        />

                        {loading && (
                            <motion.div
                                className="flex flex-col items-center mt-6"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

                                <motion.p
                                    className="mt-4 text-blue-300"
                                    animate={{
                                        opacity: [0.4, 1, 0.4]
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity
                                    }}
                                >
                                    Scanning target this may take a while...
                                </motion.p>
                            </motion.div>
                        )}

                        <motion.button
                            onClick={handleScan}
                            disabled={loading}
                            whileHover={{
                                scale: 1.05,
                                boxShadow:
                                    "0px 0px 25px rgba(59,130,246,0.7)"
                            }}
                            whileTap={{
                                scale: 0.95
                            }}
                            className="mt-6 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg w-full font-semibold transition-all"
                        >
                            {loading ? "Scanning..." : "Start Scan"}
                        </motion.button>

                    </motion.div>

                </motion.div>

            </div>
        </>
    );
}

export default Home;