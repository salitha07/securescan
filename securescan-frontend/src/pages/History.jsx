import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function History() {

    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const fetchHistory = async () => {

        try {

            const response = await axios.get(
                "http://localhost:8080/scan/history"
            );

            setHistory(response.data);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {

        const loadHistory = async () => {
            await fetchHistory();
        };

        loadHistory();

    }, []);
    return (
        <>
            <Navbar />

        <div className="min-h-screen bg-gray-100 p-8">

            <div className="max-w-6xl mx-auto bg-white p-8 rounded-xl shadow-md">

                <div className="flex justify-between items-center mb-6">

                    <div>

                        <h1 className="text-4xl font-bold text-gray-800">
                            Scan History
                        </h1>

                        <p className="text-gray-600 mt-2">
                            Previously scanned targets
                        </p>

                    </div>

                    <button
                        onClick={() => navigate("/")}
                        className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800"
                    >
                        Back
                    </button>

                </div>

                {loading ? (

                    <p>Loading history...</p>

                ) : history.length === 0 ? (

                    <p className="text-red-500">
                        No scan history found.
                    </p>

                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">

                            <thead className="bg-gray-800 text-white">

                            <tr>
                                <th className="p-3 text-left">Target</th>
                                <th className="p-3 text-left">Port</th>
                                <th className="p-3 text-left">State</th>
                                <th className="p-3 text-left">Service</th>
                                <th className="p-3 text-left">Version</th>
                                <th className="p-3 text-left">Date</th>
                            </tr>

                            </thead>

                            <tbody>

                            {history.map((item, index) => (

                                <tr
                                    key={index}
                                    className="border-b hover:bg-gray-100"
                                >

                                    <td className="p-3">
                                        {item.target}
                                    </td>

                                    <td className="p-3">
                                        {item.port}
                                    </td>

                                    <td className="p-3">

                                        <span
                                            className={
                                                item.state === "open"
                                                    ? "text-green-600 font-bold"
                                                    : "text-red-600 font-bold"
                                            }
                                        >
                                            {item.state}
                                        </span>

                                    </td>

                                    <td className="p-3">
                                        {item.service}
                                    </td>

                                    <td className="p-3">
                                        {item.version}
                                    </td>

                                    <td className="p-3">
                                        {item.scanDate}
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

export default History;