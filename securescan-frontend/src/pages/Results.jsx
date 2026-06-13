import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import bgImage from "../assets/bg2.jpg"

function Results() {

    const location = useLocation();
    const navigate = useNavigate();

    const results = location.state?.results || [];
    const target = location.state?.target || "Unknown";

    return (
        <div
            className="min-h-screen bg-cover bg-center"
            style={{
                backgroundImage: `url(${bgImage})`
            }}
        >
        <Navbar />



        <div className="min-h-screen bg-black/70 p-8 pt-28">

            <div className="max-w-5xl mx-auto bg-white/10 backdrop-blur-md border border-white/10 p-8 rounded-2xl shadow-2xl text-white">

                <div className="flex justify-between items-center mb-6" >

                    <div>
                        <h1 className="text-4xl font-bold text-gray-800">
                            Scan Results
                        </h1>

                        <p className="text-gray-600 mt-2">
                            Target: {target}
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/")}
                        className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800"
                    >
                        Back
                    </button>

                </div>

                {results.length === 0 ? (

                    <p className="text-red-500">
                        No scan results found.
                    </p>

                ) : (

                    <div className="overflow-x-auto">

                        <div className="space-y-6">

                            {results.map((result, index) => (

                                <div
                                    key={index}
                                    className="bg-slate-900/80 border border-slate-700 rounded-xl p-6"
                                >

                                    <div className="flex justify-between items-start">

                                        <div>

                                            <h2 className="text-2xl font-bold">
                                                Port {result.port}
                                            </h2>

                                            <p className="text-slate-400">
                                                {result.service}
                                            </p>

                                            <p className="text-slate-400">
                                                {result.version}
                                            </p>

                                        </div>

                                        <span
                                            className={
                                                result.state === "open"
                                                    ? "bg-green-600 px-3 py-1 rounded-full text-sm"
                                                    : "bg-red-600 px-3 py-1 rounded-full text-sm"
                                            }
                                        >
                    {result.state}
                </span>

                                    </div>

                                    <div className="mt-6">

                                        <h3 className="text-lg font-semibold mb-3">
                                            Vulnerabilities
                                        </h3>

                                        {result.cves?.length > 0 ? (

                                            result.cves.map((cve, i) => (

                                                <div
                                                    key={i}
                                                    className="bg-slate-800 border border-slate-600 rounded-lg p-4 mb-3"
                                                >

                                                    <div className="flex justify-between">

                                <span className="font-bold text-red-400">
                                    {cve.cveId}
                                </span>

                                                        <span
                                                            className={
                                                                cve.severity === "CRITICAL"
                                                                    ? "text-red-500 font-bold"
                                                                    : cve.severity === "HIGH"
                                                                        ? "text-orange-400 font-bold"
                                                                        : cve.severity === "MEDIUM"
                                                                            ? "text-yellow-400 font-bold"
                                                                            : "text-green-400 font-bold"
                                                            }
                                                        >
                                    {cve.severity}
                                </span>

                                                    </div>

                                                    <p className="text-slate-300 mt-2">
                                                        {cve.description}
                                                    </p>

                                                </div>
                                            ))

                                        ) : (

                                            <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
                                                No known vulnerabilities found
                                            </div>

                                        )}

                                    </div>

                                </div>

                            ))}

                        </div>

                    </div>
                )}

            </div>

        </div>
        </div>
    );
}

export default Results;