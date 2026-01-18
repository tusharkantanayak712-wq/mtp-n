"use client";

import { useState } from "react";

export default function CheckPage() {
  const [game, setGame] = useState("");
  const [userId, setUserId] = useState("");
  const [serverId, setServerId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleCheck = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    if (!game || !userId) {
      setError("Game and User ID are required");
      setLoading(false);
      return;
    }

    try {
      let url = `https://game-off-ten.vercel.app/api/v1/check?game=${game}&user_id=${userId}`;
      if (serverId) {
        url += `&server_id=${serverId}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok) {
        setError(JSON.stringify(data, null, 2));
      } else {
        setResult(data);
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h2>Game Checker</h2>

      <input
        placeholder="Game code (bgmi, pubg, mlbb...)"
        value={game}
        onChange={(e) => setGame(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 10 }}
      />

      <input
        placeholder="User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 10 }}
      />

      <input
        placeholder="Server ID (optional)"
        value={serverId}
        onChange={(e) => setServerId(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 10 }}
      />

      <button
        onClick={handleCheck}
        disabled={loading}
        style={{
          width: "100%",
          padding: 10,
          cursor: "pointer",
        }}
      >
        {loading ? "Checking..." : "Check Player"}
      </button>

      {/* ===== RESULT ===== */}
      {result && (
        <pre
          style={{
            marginTop: 20,
            padding: 10,
            background: "#f4f4f4",
            overflow: "auto",
          }}
        >
          {JSON.stringify(result, null, 2)}
        </pre>
      )}

      {/* ===== ERROR ===== */}
      {error && (
        <pre
          style={{
            marginTop: 20,
            padding: 10,
            background: "#ffe5e5",
            color: "red",
            overflow: "auto",
          }}
        >
          {error}
        </pre>
      )}
    </div>
  );
}
