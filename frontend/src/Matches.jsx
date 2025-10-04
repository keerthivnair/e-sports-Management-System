import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Matches = () => {
  let { id } = useParams();
  const region = id || "na";
  const [matchesData, setMatchesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchMatches() {
    console.log("fetching match results data");
    setIsLoading(true);
    
    const queryType = "results"; // match results
    const url = `https://vlrggapi.vercel.app/match?q=${queryType}`;

    try {
      const response = await fetch(url);
      const json = await response.json();

      console.log("Match Results Data:", json);
      setMatchesData(json.data?.segments || []); //segments to get the match results
    } catch (error) {
      console.error('Error fetching match results:', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchMatches();
  }, [region]);

  if (isLoading) {
    return (
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold">Loading Match Results...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-950 p-4">
      <h1 className="text-5xl font-bold text-center text-white mb-6">Match Results for {region.toUpperCase()}</h1>

      {matchesData.length === 0 ? (
        <div className="text-center text-white text-2xl">No match results available for this region.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {matchesData.map((match, index) => (
            <div key={index} className="bg-gray-800 text-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold">{match.team1} vs {match.team2}</h3>
              <p className="mt-4"><b>Score: </b> {match.score1} - {match.score2}</p>
              <p><b>Time:</b> {match.time_completed}</p>
              <p><b>Round:</b> {match.round_info}</p>
              <p><b>Tournament:</b> {match.tournament_name}</p>
              <div className="mt-4">
                <img src={match.tournament_icon} alt={match.tournament_name} className="w-12 h-12" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Matches;
