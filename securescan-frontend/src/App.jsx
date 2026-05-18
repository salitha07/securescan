import { useState } from "react";
import axios from "axios";

function App() {
  const [target, setTarget] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

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

    } catch (error) {
      console.error(error);
      alert("Scan failed");
    } finally {
      setLoading(false);
    }
  };

  return (
      <div style={{ padding: "20px" }}>
        <h1>SecureScan</h1>

        <input
            type="text"
            placeholder="Enter IP or domain"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
        />

        <button onClick={handleScan}>
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
      </div>
  );
}

export default App;