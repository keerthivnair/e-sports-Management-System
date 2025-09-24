import React, { useEffect, useState } from "react";
import { useLocation, useParams, Link } from "react-router-dom";

const EventDetails = () => {
  const { id } = useParams(); // Event title from URL
  const location = useLocation();
  const view = location.state?.view || "upcoming"; // "upcoming" or "completed"

  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Normalize strings for loose matching
  const normalize = (str) =>
    str ? str.toLowerCase().replace(/[^a-z0-9]/g, "") : "";

  // Fetch matches from API
 // Fetch matches from API
async function fetchMatches() {
  try {
    setIsLoading(true);
    const q = view === "upcoming" ? "upcoming" : "results";
    const res = await fetch(`https://vlrggapi.vercel.app/match?q=${q}`);
    const json = await res.json();
    const segments = json?.data?.segments || [];

    // Normalize event name from URL
    const normalizedId = normalize(id);

    // Filter matches loosely by all possible event name fields
    const filtered = segments.filter((match) => {
      const eventName =
        match.tournament_name ||
        match.match_event ||
        match.event_name || // Add this field for completed matches
        match.series_name ||
        "";
      return normalize(eventName).includes(normalizedId);
    });

    setMatches(filtered);
  } catch (error) {
    console.error("Error fetching matches:", error);
  } finally {
    setIsLoading(false);
  }
}


  useEffect(() => {
    fetchMatches();
  }, [id, view]);

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-red-950">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-white to-red-400 tracking-wider">
            LOADING MATCHES
          </h1>
        </div>
      </div>
    );

  if (matches.length === 0)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-gray-900 to-red-950 text-white px-4">
        <h1 className="text-4xl font-bold mb-4">No Matches Found</h1>
        <p className="text-gray-400 mb-6">
          No matches are available for this event.
        </p>
        <Link
          to="/events"
          className="px-6 py-3 bg-red-600 rounded-lg font-bold hover:bg-red-500 transition"
        >
          Back to Events
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-950 px-4 py-10">
      <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-white to-red-400 text-center mb-10">
        {id}
      </h1>

      <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-2">
        {matches.map((match, idx) => (
          <div
            key={idx}
            className="bg-gradient-to-r from-black via-gray-900 to-black border-2 border-gray-800 rounded-2xl p-6 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-red-500/20"
          >
            <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
              {match.match_series || match.round_info || "Match Series"}
            </h3>

            {/* Teams */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                {match.team1_logo ? (
                  <img
                    src={match.team1_logo}
                    alt={match.team1}
                    className="w-12 h-12 object-contain rounded-full"
                  />
                ) : (
                  <span className="text-3xl">{match.flag1 || "🏳️"}</span>
                )}
                <span className="text-white font-bold">{match.team1}</span>
              </div>

              <span className="text-red-500 font-black text-lg">VS</span>

              <div className="flex items-center space-x-2">
                {match.team2_logo ? (
                  <img
                    src={match.team2_logo}
                    alt={match.team2}
                    className="w-12 h-12 object-contain rounded-full"
                  />
                ) : (
                  <span className="text-3xl">{match.flag2 || "🏳️"}</span>
                )}
                <span className="text-white font-bold">{match.team2}</span>
              </div>
            </div>

            {/* Match Info */}
            {view === "upcoming" ? (
              <p className="text-gray-400">
                🕒 {match.time_until_match || "Time not available"}
              </p>
            ) : (
              <p className="text-gray-400">
                🏆 Score: {match.score1}-{match.score2}{" "}
                {match.time_completed && `| ${match.time_completed}`}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventDetails;
