import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";

const TeamDetails = () => {
  const { teamName } = useParams();
  const location = useLocation();
  const region = location.state?.region || "na";

  const [activeTab, setActiveTab] = useState("members");
  const [teamMembers, setTeamMembers] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [completedMatches, setCompletedMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [timespan] = useState('all');

  // Fetch team members from stats API
  const fetchTeamMembers = async () => {
    try {
      const response = await fetch(
        `https://vlrggapi.vercel.app/stats?region=${region}&timespan='${timespan}'`
      );
      const data = await response.json();

      if (data.data && data.data.segments) {
        // Filter players by team name (org)
        const members = data.data.segments.filter(
          (player) => player.org.toLowerCase() === teamName.toLowerCase()
        );
        setTeamMembers(members);
      }
    } catch (error) {
      console.error("Error fetching team members:", error);
    }
  };

  // Fetch matches
  const fetchMatches = async () => {
    try {
      // Fetch upcoming matches
      const upcomingRes = await fetch(
        "https://vlrggapi.vercel.app/match?q=upcoming"
      );
      const upcomingData = await upcomingRes.json();

      // Fetch completed matches
      const completedRes = await fetch(
        "https://vlrggapi.vercel.app/match?q=results"
      );
      const completedData = await completedRes.json();

      // Filter matches where this team is involved
      if (upcomingData.data && upcomingData.data.segments) {
        const teamUpcoming = upcomingData.data.segments.filter(
          (match) =>
            match.team1?.toLowerCase().includes(teamName.toLowerCase()) ||
            match.team2?.toLowerCase().includes(teamName.toLowerCase())
        );
        setUpcomingMatches(teamUpcoming);
      }

      if (completedData.data && completedData.data.segments) {
        const teamCompleted = completedData.data.segments.filter(
          (match) =>
            match.team1?.toLowerCase().includes(teamName.toLowerCase()) ||
            match.team2?.toLowerCase().includes(teamName.toLowerCase())
        );
        setCompletedMatches(teamCompleted);
      }
    } catch (error) {
      console.error("Error fetching matches:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchTeamMembers(), fetchMatches()]);
      setLoading(false);
    };
    loadData();
  }, [teamName, region]);

  const openPlayerModal = (player) => {
    setSelectedPlayer(player);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPlayer(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-red-950">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-white to-red-400 tracking-wider">
            LOADING TEAM DATA
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-950 pb-16">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-transparent"></div>
        <div className="relative z-10 text-center py-12 px-4">
          <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-white to-red-400 mb-4 animate-pulse">
            {teamName.toUpperCase()}
          </h1>
          {/* <p className="text-xl text-gray-300">
            Region: <span className="text-red-400 font-bold">{region.toUpperCase()}</span>
          </p> */}
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setActiveTab("members")}
            className={`px-8 py-3 rounded-lg font-bold uppercase text-sm tracking-wider transition-all duration-300 transform hover:scale-105 ${
              activeTab === "members"
                ? "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-500/50"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
             Team Members
          </button>
          <button
            onClick={() => setActiveTab("matches")}
            className={`px-8 py-3 cursor-pointer rounded-lg font-bold uppercase text-sm tracking-wider transition-all duration-300 transform hover:scale-105 ${
              activeTab === "matches"
                ? "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-500/50"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
             Matches
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4">
        {activeTab === "members" ? (
          <div>
            <h2 className="text-3xl font-bold text-white mb-6 border-l-4 border-red-500 pl-4">
              Team Roster
            </h2>
            {teamMembers.length === 0 ? (
              <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-8 text-center">
                <p className="text-gray-400 text-lg">
                  No team members found.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {teamMembers.map((player, index) => (
                  <div
                    key={index}
                    onClick={() => openPlayerModal(player)}
                    className="group bg-gradient-to-r from-gray-900 via-black to-gray-900 border-2 border-gray-800 hover:border-red-500 rounded-xl p-6 transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:shadow-2xl hover:shadow-red-500/20"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center">
                          <span className="text-xl font-black text-white">
                            {player.player.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white group-hover:text-red-400 transition-colors">
                            {player.player}
                          </h3>
                          <p className="text-gray-400 text-sm">{player.org}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <p className="text-xs text-gray-500 uppercase">Rating</p>
                          <p className="text-xl font-bold text-red-400">{player.rating}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500 uppercase">ACS</p>
                          <p className="text-xl font-bold text-white">
                            {player.average_combat_score}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500 uppercase">K:D</p>
                          <p className="text-xl font-bold text-white">{player.kill_deaths}</p>
                        </div>
                        <svg
                          className="w-6 h-6 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            {/* Upcoming Matches */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6 border-l-4 border-red-500 pl-4">
                Upcoming Matches
              </h2>
              {upcomingMatches.length === 0 ? (
                <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-8 text-center">
                  <p className="text-gray-400 text-lg">No upcoming matches found.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {upcomingMatches.map((match, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-gray-900 via-black to-gray-900 border-2 border-gray-800 hover:border-red-500 rounded-xl p-6 transition-all duration-300 hover:scale-[1.02]"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-center flex-1">
                          <p className="text-xl font-bold text-white">{match.team1}</p>
                          <p className="text-sm text-gray-500">{match.flag1}</p>
                        </div>
                        <div className="px-4">
                          <p className="text-2xl font-black text-red-500">VS</p>
                        </div>
                        <div className="text-center flex-1">
                          <p className="text-xl font-bold text-white">{match.team2}</p>
                          <p className="text-sm text-gray-500">{match.flag2}</p>
                        </div>
                      </div>
                      <div className="border-t border-gray-700 pt-4">
                        <p className="text-sm text-gray-400 mb-1">
                          ⏰ {match.time_until_match}
                        </p>
                        <p className="text-sm text-gray-400 mb-1">
                          🏆 {match.match_event}
                        </p>
                        <p className="text-xs text-gray-500">{match.match_series}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Completed Matches */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-6 border-l-4 border-red-500 pl-4">
                Recent Results
              </h2>
              {completedMatches.length === 0 ? (
                <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-8 text-center">
                  <p className="text-gray-400 text-lg">No recent matches found.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {completedMatches.map((match, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-gray-900 via-black to-gray-900 border-2 border-gray-800 hover:border-red-500 rounded-xl p-6 transition-all duration-300 hover:scale-[1.02]"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-center flex-1">
                          <p className="text-xl font-bold text-white">{match.team1}</p>
                          <p className="text-3xl font-black text-red-400 mt-2">
                            {match.score1}
                          </p>
                        </div>
                        <div className="px-4">
                          <p className="text-xl font-black text-gray-600">-</p>
                        </div>
                        <div className="text-center flex-1">
                          <p className="text-xl font-bold text-white">{match.team2}</p>
                          <p className="text-3xl font-black text-red-400 mt-2">
                            {match.score2}
                          </p>
                        </div>
                      </div>
                      <div className="border-t border-gray-700 pt-4">
                        <p className="text-sm text-gray-400 mb-1">
                          ⏱️ {match.time_completed}
                        </p>
                        <p className="text-sm text-gray-400 mb-1">
                          🏆 {match.tournament_name}
                        </p>
                        <p className="text-xs text-gray-500">{match.round_info}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Player Stats Modal */}
      {showModal && selectedPlayer && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-gradient-to-br from-gray-900 via-black to-gray-900 border-2 border-red-500 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl shadow-red-500/50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-white to-red-400">
                  {selectedPlayer.player.toUpperCase()}
                </h2>
                <p className="text-gray-400 text-lg">{selectedPlayer.org}</p>
              </div>
              <button
                onClick={closeModal}
                className="w-10 h-10 bg-red-600 hover:bg-red-500 rounded-lg flex items-center justify-center transition-colors duration-300"
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Main Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-red-900/30 border border-red-500 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-400 uppercase mb-1">Rating</p>
                <p className="text-3xl font-black text-red-400">{selectedPlayer.rating}</p>
              </div>
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-400 uppercase mb-1">ACS</p>
                <p className="text-3xl font-black text-white">
                  {selectedPlayer.average_combat_score}
                </p>
              </div>
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-400 uppercase mb-1">K:D</p>
                <p className="text-3xl font-black text-white">
                  {selectedPlayer.kill_deaths}
                </p>
              </div>
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-400 uppercase mb-1">KAST</p>
                <p className="text-3xl font-black text-white">
                  {selectedPlayer.kill_assists_survived_traded}
                </p>
              </div>
            </div>

            {/* Detailed Stats */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-red-400 mb-4 uppercase">
                  Combat Stats
                </h3>
                <div className="flex justify-between bg-gray-800/30 p-3 rounded-lg">
                  <span className="text-gray-400">ADR</span>
                  <span className="text-white font-semibold">
                    {selectedPlayer.average_damage_per_round}
                  </span>
                </div>
                <div className="flex justify-between bg-gray-800/30 p-3 rounded-lg">
                  <span className="text-gray-400">KPR</span>
                  <span className="text-white font-semibold">
                    {selectedPlayer.kills_per_round}
                  </span>
                </div>
                <div className="flex justify-between bg-gray-800/30 p-3 rounded-lg">
                  <span className="text-gray-400">APR</span>
                  <span className="text-white font-semibold">
                    {selectedPlayer.assists_per_round}
                  </span>
                </div>
                <div className="flex justify-between bg-gray-800/30 p-3 rounded-lg">
                  <span className="text-gray-400">Headshot %</span>
                  <span className="text-white font-semibold">
                    {selectedPlayer.headshot_percentage}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-bold text-red-400 mb-4 uppercase">
                  Performance Stats
                </h3>
                <div className="flex justify-between bg-gray-800/30 p-3 rounded-lg">
                  <span className="text-gray-400">FKPR</span>
                  <span className="text-white font-semibold">
                    {selectedPlayer.first_kills_per_round}
                  </span>
                </div>
                <div className="flex justify-between bg-gray-800/30 p-3 rounded-lg">
                  <span className="text-gray-400">FDPR</span>
                  <span className="text-white font-semibold">
                    {selectedPlayer.first_deaths_per_round}
                  </span>
                </div>
                <div className="flex justify-between bg-gray-800/30 p-3 rounded-lg">
                  <span className="text-gray-400">Clutch Success %</span>
                  <span className="text-white font-semibold">
                    {selectedPlayer.clutch_success_percentage}
                  </span>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={closeModal}
                className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-500/50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamDetails;

