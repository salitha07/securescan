import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

function Results() {

    const location = useLocation();
    const navigate = useNavigate();

    const results = location.state?.results || [];
    const target = location.state?.target || "Unknown";

    return (
        <>
        <Navbar />

        <div className="min-h-screen bg-gray-100 p-8">

            <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow-md">

                <div className="flex justify-between items-center mb-6">

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

                        <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">

                            <thead className="bg-gray-800 text-white">

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
                                    className="border-b hover:bg-gray-100"
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
                                    </td>

                                </tr>
                            ))}

                            </tbody>

                        </table>

                    </div>
                )}

            </div>

        </div>
            </>
    );
}

export default Results;