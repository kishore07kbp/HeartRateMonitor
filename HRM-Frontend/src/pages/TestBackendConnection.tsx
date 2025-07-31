import React, { useEffect, useState } from "react";
import axios from "axios";

const TestBackendConnection: React.FC = () => {
  const [status, setStatus] = useState<string>("Checking backend...");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    axios
      .get("http://localhost:8080/actuator/health")
      .then((response) => {
        setStatus(`Backend is UP: ${response.data.status}`);
      })
      .catch((err) => {
        setError("Failed to connect to backend. Check CORS and server.");
        console.error(err);
      });
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Backend Connection Test</h2>
      {error ? <p className="text-red-500">{error}</p> : <p>{status}</p>}
    </div>
  );
};

export default TestBackendConnection;
