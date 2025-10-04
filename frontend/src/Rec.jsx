import React, { useState } from "react";

const Recommend = () => {
  const [region, setRegion] = useState("");
  const [player, setPlayer] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const shortNames = [
    { key: "na", name: "North America", flag: "🇺🇸" },
    { key: "eu", name: "Europe", flag: "🇪🇺" },
    { key: "ap", name: "Asia-Pacific", flag: "🌏" },
    { key: "la-s", name: "LA-S", flag: "🇧🇷" },
    { key: "la-n", name: "LA-N", flag: "🇲🇽" },
    { key: "oce", name: "Oceania", flag: "🇦🇺" },
    { key: "kr", name: "Korea", flag: "🇰🇷" },
    { key: "mn", name: "MENA", flag: "🌍" },
    { key: "gc", name: "GC", flag: "⚡" },
    { key: "br", name: "Brazil", flag: "🇧🇷" },
    { key: "cn", name: "China", flag: "🇨🇳" },
    { key: "jp", name: "Japan", flag: "🇯🇵" },
    { key: "col", name: "Collegiate", flag: "🎓" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("http://localhost:3000/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ region, player }),
      });
      const data = await res.json();
      if (data.error) setError(data.error);
      else setResult(data);
    } catch (err) {
      setError(err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-red-950 p-6">
      <div className="w-full max-w-lg bg-black/70 border border-red-700 rounded-2xl shadow-xl p-8 relative overflow-hidden">
        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-white to-red-400 text-center mb-6">
          Agent Recommendation
        </h1>

        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-transparent to-red-500/10 animate-pulse pointer-events-none"></div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {/* Region */}
          <div>
            <label className="block text-sm font-semibold text-red-300 mb-1">
              Select Region
            </label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">-- Choose a Region --</option>
              {shortNames.map(({ key, name, flag }) => (
                <option key={key} value={key}>
                  {flag} {name}
                </option>
              ))}
            </select>
          </div>

          {/* Player */}
          <div>
            <label className="block text-sm font-semibold text-red-300 mb-1">
              Player Name
            </label>
            <input
              type="text"
              value={player}
              onChange={(e) => setPlayer(e.target.value)}
              placeholder="Enter player name..."
              className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 font-bold rounded-lg bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white tracking-wider shadow-lg shadow-red-800/50 transition-transform transform hover:scale-[1.02] disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Get Recommendations"}
          </button>
        </form>

        {/* Error */}
        {error && (
          <p className="mt-4 text-center text-red-400 font-semibold">{error}</p>
        )}

        {/* Results */}
        {result && (
          <div className="mt-6 p-4 bg-gray-900/80 border border-red-600 rounded-lg relative z-10">
            <h2 className="text-xl font-bold text-red-400 text-center mb-3">
              Results for {result.player}
            </h2>
            <p className="text-gray-200 text-center mb-2">
              <span className="font-semibold">Level w.r.t Best:</span> {result.level}/ 100
            </p>
            <p className="text-gray-200 text-center mb-2">
              <span className="font-semibold">Current Rating:</span> {result.curr_rating}
            </p>
            <p className="text-gray-200 text-center mb-2">
              <span className="font-semibold">Best Rating:</span> {result.best_rating}
            </p>
            <p className="text-gray-300 text-sm mb-3">
              <span className="font-semibold text-red-300">Weak Stats:</span>{" "}
              {Object.keys(result.differences)
                .filter((s) => result.differences[s] > 0)
                .join(", ") || "None"}
            </p>
            <p className="text-gray-200 text-sm">
              <span className="font-semibold text-red-300">
                Recommended Agents:
              </span>{" "}
              {result.recommendedAgents.length > 0
                ? result.recommendedAgents.join(", ")
                : "No suggestions"}
            </p>
            <p className="text-gray-400 text-xs mt-2 text-center">
              Best Player in region: {result.bestPlayer}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recommend;