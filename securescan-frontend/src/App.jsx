import { useState, useEffect } from "react";
import axios from "axios";

function App() {

    const [target, setTarget] = useState("");
    const [results, setResults] = useState([]);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch scan history from backend
    const fetchHistory = async () => {

        try {

            const response = await axios.get(
                "http://localhost:8080/scan/history"
            );

            setHistory(response.data);

        } catch (error) {
            console.error(error);
        }
    };

    // Load history when page opens
    useEffect(() => {

        const loadHistory = async () => {
            await fetchHistory();
        };

        loadHistory();

    }, []);;

    // Run scan
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

            setResults(response.data);

            // Refresh history after scan
            fetchHistory();

        } catch (error) {

            console.error(error);
            alert("Scan failed");

        } finally {

            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto bg-gray-300 p-6 rounded-xl shadow-md">

        <div className="min-h-screen bg-blue-950-100 p-8">

            <h1 className="text-4xl font-bold text-blue-500">
                SecureScan
            </h1>

            <input
                type="text"
                placeholder="Enter IP or domain"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="border p-3 rounded-lg w-full"
            />

            <button
                onClick={handleScan}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg mt-4 hover:bg-blue-600"
            >
                Start Scan
            </button>

            {loading && <p>Scanning...</p>}

            <h2>Results</h2>

            {results.map((result, index) => (
                <div key={index}>
                    <p>Port: {result.port}</p>
                    <p>State: {result.state}</p>
                    <p>Service: {result.service}</p>
                    <p>Version: {result.version}</p>
                    <hr />
                </div>
            ))}

            <h2>Scan History</h2>

            {history.map((item, index) => (
                <div key={index}>
                    <p>Target: {item.target}</p>
                    <p>Port: {item.port}</p>
                    <p>State: {item.state}</p>
                    <p>Service: {item.service}</p>
                    <p>Version: {item.version}</p>
                    <p>Date: {item.scanDate}</p>
                    <hr />
                </div>
            ))}

        </div>
        </div>
    );
}

export default App;