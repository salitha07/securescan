import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import bgImage from "../assets/homebg.jpg";

function Home() {

    const [target, setTarget] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleScan = async () => {

        if (!target) {
            alert("Enter IP or domain");
            return;
        }

        try {

            setLoading(true);

            const response = await axios.get(
                `http://localhost:8080/scan?target=${target}`
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

    return (

        <>
            <Navbar />

            <div
                className="min-h-screen bg-cover bg-center"
                style={{
                    backgroundImage: `url(${bgImage})`
                }}
            >

                <div className="min-h-screen bg-black/60 flex items-center justify-center">

                    <div className="bg-p/10 backdrop-blur-md p-10 rounded-2xl shadow-2xl w-full max-w-2xl text-white">

                        <h1 className="text-5xl font-bold mb-6">
                            SecureScan
                        </h1>

                        <p className="mb-6 text-gray-300">
                            Scan networks, detect services, and track scan history.
                        </p>

                        <input
                            type="text"
                            placeholder="Enter IP or domain"
                            value={target}
                            onChange={(e) => setTarget(e.target.value)}
                            className="w-full p-4 rounded-lg bg-white/20 border border-white/20 text-white placeholder-gray-300 outline-none"
                        />

                        <button
                            onClick={handleScan}
                            disabled={loading}
                            className="mt-4 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg w-full"
                        >
                            {loading ? "Scanning..." : "Start Scan"}
                        </button>

                    </div>

                </div>

            </div>
        </>
    );
}

export default Home;