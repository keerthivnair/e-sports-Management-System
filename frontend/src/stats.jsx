import React, { useState, useEffect } from "react";

const Stats = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter states
  const [selectedRegion, setSelectedRegion] = useState("na");
  const [selectedTimespan, setSelectedTimespan] = useState("'all'");
  const [minRounds, setMinRounds] = useState("200");
  const [sortBy, setSortBy] = useState("rating");
  const [sortOrder, setSortOrder] = useState("desc");

  const regions = [
    { key: "na", name: "North America", flag: "🇺🇸" },
    { key: "eu", name: "Europe", flag: "🇪🇺" },
    { key: "br", name: "Brazil", flag: "🇧🇷" },
    { key: "ap", name: "Asia-Pacific", flag: "🌏" },
    { key: "kr", name: "Korea", flag: "🇰🇷" },
    { key: "jp", name: "Japan", flag: "🇯🇵" },
    { key: "la-n", name: "LA-N", flag: "🇲🇽" },
    { key: "la-s", name: "LA-S", flag: "🌎" },
    { key: "oce", name: "Oceania", flag: "🇦🇺" },
    { key: "mn", name: "MENA", flag: "🌍" },
    { key: "gc", name: "Game Changers", flag: "⚡" },
    { key: "cn", name: "China", flag: "🇨🇳" },
  ];

  const timespans = [
    { key: "'all'", name: "All time" },
    { key: "30", name: "Past 30 days" },
    { key: "60", name: "Past 60 days" },
    { key: "90", name: "Past 90 days" },
    
  ];

  // Fetch stats data
  const fetchStats = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `https://vlrggapi.vercel.app/stats?region=${selectedRegion}&timespan=${selectedTimespan}`
      );
      const data = await response.json();
      
      if (data.data && data.data.segments) {
        setStats(data.data.segments);
      } else {
        setError("No data available");
      }
    } catch (err) {
      setError("Failed to fetch stats data");
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, [selectedRegion, selectedTimespan]);

  // Filter and sort stats
  const getFilteredStats = () => {
    let filtered = [...stats];

    // Filter by minimum rounds (if rounds data exists)
    if (minRounds) {
      filtered = filtered.filter(() => true); // API doesn't provide rounds data, keep all
    }

    // Sort data
    filtered.sort((a, b) => {
      let aVal, bVal;

      switch (sortBy) {
        case "rating":
          aVal = parseFloat(a.rating || 0);
          bVal = parseFloat(b.rating || 0);
          break;
        case "acs":
          aVal = parseFloat(a.average_combat_score || 0);
          bVal = parseFloat(b.average_combat_score || 0);
          break;
        case "kd":
          aVal = parseFloat(a.kill_deaths || 0);
          bVal = parseFloat(b.kill_deaths || 0);
          break;
        case "adr":
          aVal = parseFloat(a.average_damage_per_round || 0);
          bVal = parseFloat(b.average_damage_per_round || 0);
          break;
        case "kpr":
          aVal = parseFloat(a.kills_per_round || 0);
          bVal = parseFloat(b.kills_per_round || 0);
          break;
        case "hs":
          aVal = parseFloat(a.headshot_percentage?.replace("%", "") || 0);
          bVal = parseFloat(b.headshot_percentage?.replace("%", "") || 0);
          break;
        default:
          aVal = parseFloat(a.rating || 0);
          bVal = parseFloat(b.rating || 0);
      }

      return sortOrder === "desc" ? bVal - aVal : aVal - bVal;
    });

    return filtered;
  };

  const filteredStats = getFilteredStats();

  // Get color for stat cell based on value
  const getStatColor = (value, type) => {
    const numValue = parseFloat(value);
    
    if (type === "rating") {
      if (numValue >= 1.20) return "bg-purple-500/30";
      if (numValue >= 1.10) return "bg-blue-500/30";
      if (numValue >= 1.00) return "bg-green-500/30";
      if (numValue >= 0.90) return "bg-yellow-500/30";
      return "bg-orange-500/30";
    }
    
    if (type === "kd") {
      if (numValue >= 1.40) return "bg-purple-500/30";
      if (numValue >= 1.20) return "bg-blue-500/30";
      if (numValue >= 1.00) return "bg-green-500/30";
      if (numValue >= 0.85) return "bg-yellow-500/30";
      return "bg-orange-500/30";
    }

    return "bg-gray-800/50";
  };

  const applyFilters = () => {
    fetchStats();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-red-950">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-white to-red-400 tracking-wider">
            LOADING STATS
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
            PLAYER STATS
          </h1>
          <h2 className="text-2xl md:text-4xl font-bold text-white tracking-widest uppercase">
            Performance Rankings
          </h2>
        </div>
      </div>

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto px-4 my-8">
        <div className="bg-black/60 border border-red-800 rounded-2xl p-6 shadow-2xl">
          <h3 className="text-xl font-bold text-red-400 mb-4 uppercase">Filters</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Region Filter */}
            <div>
              <label className="block text-sm font-semibold text-red-300 mb-2">Region</label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {regions.map(({ key, name, flag }) => (
                  <option key={key} value={key}>
                     {name}
                  </option>
                ))}
              </select>
            </div>

            {/* Timespan Filter */}
            <div>
              <label className="block text-sm font-semibold text-red-300 mb-2">Timespan</label>
              <select
                value={selectedTimespan}
                onChange={(e) => setSelectedTimespan(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {timespans.map(({ key, name }) => (
                  <option key={key} value={key}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-semibold text-red-300 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="rating">Rating</option>
                <option value="acs">ACS</option>
                <option value="kd">K:D</option>
                <option value="adr">ADR</option>
                <option value="kpr">KPR</option>
                <option value="hs">HS%</option>
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-sm font-semibold text-red-300 mb-2">Sort Order</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="desc">Highest First</option>
                <option value="asc">Lowest First</option>
              </select>
            </div>
          </div>

          <button
            onClick={applyFilters}
            className="mt-4 px-6 py-2 font-bold rounded-lg bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white tracking-wider shadow-lg shadow-red-800/50 transition-transform transform hover:scale-[1.02]"
          >
            Apply Filters
          </button>
        </div>
      </div>
       {/* Stats Legend */}
       <div className="max-w-7xl mx-auto px-4 my-8">
        <div className="bg-black/60 border border-gray-800 rounded-lg p-4">
          <h4 className="text-sm font-bold text-red-400 mb-2">STAT ABBREVIATIONS:</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 text-xs text-gray-400">
            <div><span className="text-red-300">ACS:</span> Average Combat Score</div>
            <div><span className="text-red-300">K:D:</span> Kill:Death Ratio</div>
            <div><span className="text-red-300">KAST:</span> Kill:Assist:Survive:Trade%</div>
            <div><span className="text-red-300">ADR:</span> Average Damage per Round</div>
            <div><span className="text-red-300">KPR:</span> Kills per Round</div>
            <div><span className="text-red-300">APR:</span> Assists per Round</div>
            <div><span className="text-red-300">FKPR:</span> First Kills per Round</div>
            <div><span className="text-red-300">FDPR:</span> First Deaths per Round</div>
            <div><span className="text-red-300">HS%:</span> Headshot Percentage</div>
            <div><span className="text-red-300">CL%:</span> Clutch Success %</div>
          </div>
        </div>
      </div>

      {/* Stats Table */}
      <div className="max-w-7xl mx-auto px-4">
        {error ? (
          <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 text-center">
            <p className="text-red-300 font-semibold">{error}</p>
          </div>
        ) : filteredStats.length === 0 ? (
          <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-8 text-center">
            <p className="text-gray-400 text-lg">No stats available for this region and timespan.</p>
          </div>
        ) : (
          <div className="bg-black/60 border border-red-800 rounded-2xl overflow-hidden shadow-2xl">
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-red-900/50 to-black border-b-2 border-red-500">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-red-300 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-red-300 uppercase tracking-wider">
                      Player
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-red-300 uppercase tracking-wider">
                      Org
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-red-300 uppercase tracking-wider cursor-pointer hover:text-red-400"
                        onClick={() => setSortBy("rating")}>
                      Rating
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-red-300 uppercase tracking-wider cursor-pointer hover:text-red-400"
                        onClick={() => setSortBy("acs")}>
                      ACS
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-red-300 uppercase tracking-wider cursor-pointer hover:text-red-400"
                        onClick={() => setSortBy("kd")}>
                      K:D
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-red-300 uppercase tracking-wider">
                      KAST
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-red-300 uppercase tracking-wider cursor-pointer hover:text-red-400"
                        onClick={() => setSortBy("adr")}>
                      ADR
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-red-300 uppercase tracking-wider cursor-pointer hover:text-red-400"
                        onClick={() => setSortBy("kpr")}>
                      KPR
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-red-300 uppercase tracking-wider">
                      APR
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-red-300 uppercase tracking-wider">
                      FKPR
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-red-300 uppercase tracking-wider">
                      FDPR
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-red-300 uppercase tracking-wider cursor-pointer hover:text-red-400"
                        onClick={() => setSortBy("hs")}>
                      HS%
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-red-300 uppercase tracking-wider">
                      CL%
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filteredStats.map((player, index) => (
                    <tr
                      key={index}
                      className="hover:bg-red-900/20 transition-colors duration-200 group"
                    >
                      <td className="px-4 py-3 text-white font-bold">
                        #{index + 1}
                      </td>
                      <td className="px-4 py-3 text-white font-semibold group-hover:text-red-400 transition-colors">
                        {player.player}
                      </td>
                      <td className="px-4 py-3 text-gray-300 font-medium">
                        {player.org}
                      </td>
                      <td className={`px-4 py-3 text-center text-white font-bold ${getStatColor(player.rating, "rating")}`}>
                        {player.rating}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-200">
                        {player.average_combat_score}
                      </td>
                      <td className={`px-4 py-3 text-center text-white font-bold ${getStatColor(player.kill_deaths, "kd")}`}>
                        {player.kill_deaths}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-200">
                        {player.kill_assists_survived_traded}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-200">
                        {player.average_damage_per_round}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-200">
                        {player.kills_per_round}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-200">
                        {player.assists_per_round}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-200">
                        {player.first_kills_per_round}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-200">
                        {player.first_deaths_per_round}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-200">
                        {player.headshot_percentage}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-200">
                        {player.clutch_success_percentage}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4 p-4">
              {filteredStats.map((player, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-gray-900 via-black to-gray-900 border border-gray-700 hover:border-red-500 rounded-xl p-4 transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        #{index + 1} {player.player}
                      </h3>
                      <p className="text-gray-400 text-sm">{player.org}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-lg ${getStatColor(player.rating, "rating")}`}>
                      <p className="text-xs text-gray-400">Rating</p>
                      <p className="text-lg font-bold text-white">{player.rating}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center">
                      <p className="text-xs text-gray-400">ACS</p>
                      <p className="text-sm font-semibold text-white">{player.average_combat_score}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-400">K:D</p>
                      <p className="text-sm font-semibold text-white">{player.kill_deaths}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-400">ADR</p>
                      <p className="text-sm font-semibold text-white">{player.average_damage_per_round}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-400">KAST</p>
                      <p className="text-sm font-semibold text-white">{player.kill_assists_survived_traded}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-400">HS%</p>
                      <p className="text-sm font-semibold text-white">{player.headshot_percentage}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-400">CL%</p>
                      <p className="text-sm font-semibold text-white">{player.clutch_success_percentage}</p>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-700 grid grid-cols-4 gap-2 text-xs">
                    <div className="text-center">
                      <p className="text-gray-500">KPR</p>
                      <p className="text-gray-300">{player.kills_per_round}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-500">APR</p>
                      <p className="text-gray-300">{player.assists_per_round}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-500">FKPR</p>
                      <p className="text-gray-300">{player.first_kills_per_round}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-500">FDPR</p>
                      <p className="text-gray-300">{player.first_deaths_per_round}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

     
    </div>
  );
};

export default Stats;

