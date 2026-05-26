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

                        <table className="w-full border-collapse bg-white/10 backdrop-blur-md rounded-xl overflow-hidden">

                            <thead className="bg-black/40 text-white">

                            <tr>
                                <th className="p-3 text-left">Port</th>
                                <th className="p-3 text-left">State</th>
                                <th className="p-3 text-left">Service</th>
                                <th className="p-3 text-left">Version</th>
                            </tr>

                            </thead>

                            <tbody>

                            {results.map((result, index) => (

                                <tr
                                    key={index}
                                    className="border-b border-white/10 hover:bg-white/10 transition"
                                >

                                    <td className="p-3">
                                        {result.port}
                                    </td>

                                    <td className="p-3">

                                        <span
                                            className={
                                                result.state === "open"
                                                    ? "text-green-600 font-bold"
                                                    : "text-red-600 font-bold"
                                            }
                                        >
                                            {result.state}
                                        </span>

                                    </td>

                                    <td className="p-3">
                                        {result.service}
                                    </td>

                                    <td className="p-3">
                                        {result.version}
                                        <div className="mt-4">

                                            <h3 className="text-xl font-bold mb-2">
                                                Vulnerabilities
                                            </h3>

                                            {result.cves && result.cves.length > 0 ? (

                                                result.cves.map((cve, index) => (

                                                    <div
                                                        key={index}
                                                        className="bg-red-950/40 border border-red-500 p-4 rounded-lg mb-3"
                                                    >

                                                        <p className="font-bold text-red-400">
                                                            {cve.cveId}
                                                        </p>

                                                        <p className={
                                                            cve.severity === "CRITICAL"
                                                                ? "text-red-500 font-bold"
                                                                : cve.severity === "HIGH"
                                                                    ? "text-orange-400 font-bold"
                                                                    : cve.severity === "MEDIUM"
                                                                        ? "text-yellow-400 font-bold"
                                                                        : "text-green-400 font-bold"
                                                        }>
                                                            Severity: {cve.severity}
                                                        </p>

                                                        <p className="text-gray-300 mt-2">
                                                            {cve.description}
                                                        </p>

                                                    </div>
                                                ))

                                            ) : (

                                                <p className="text-green-400">
                                                    No known vulnerabilities found.
                                                </p>
                                            )}

                                        </div>
                                    </td>

                                </tr>
                            ))}

                            </tbody>

                        </table>

                    </div>
                )}

            </div>

        </div>
        </div>
    );
}

export default Results;