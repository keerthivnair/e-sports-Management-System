import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Rankings = () => {
  let { id } = useParams();
  const region = id || "na";
  const [rankingsData, setRankingsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  async function fetchRankings() {
    console.log("fetching data");
    setIsLoading(true);
    const url = `https://vlrggapi.vercel.app/rankings?region=${region}`;

    try {
      const response = await fetch(url);
      const json = await response.json();
      console.log("THe imported content:",json);
      setRankingsData(json.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchRankings();
  }, [region]);



  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-950 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 border-2 border-white border-b-transparent rounded-full animate-spin"></div>
          </div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-white to-red-400 tracking-wider">
            LOADING
          </h1>
          <div className="flex justify-center mt-2 space-x-1">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-100"></div>
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse delay-200"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-950 p-4 md:p-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-white to-red-400 tracking-wider mb-4 drop-shadow-2xl animate-pulse">
            RANKINGS
          </h1>
          <div className="relative inline-block">
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-wide uppercase relative z-10 px-6 py-2">
              {region.toUpperCase()}
            </h2>
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-500 transform skew-x-12 rounded-lg opacity-20"></div>
          </div>
        </div>
      </div>

      {/* Rankings Grid */}
      <div className="max-w-6xl mx-auto">
        {rankingsData.length <= 0 ? (
          <div className="text-center text-white text-2xl">
            No rankings data available
          </div>
        ) : (
          <div className="grid gap-4 md:gap-6">
            {rankingsData.map(({ rank, team }, index) => (
              <div
                key={`${rank}-${team}`}
                onClick={() => navigate(`/teamrec/${region}/${team}`)}
                className="group relative bg-gradient-to-r from-black via-gray-900 to-black border-2 border-gray-800 hover:border-red-500 rounded-2xl p-6 md:p-8 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-red-500/20 transform hover:-translate-y-1 cursor-pointer"
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                {/* Rank Number */}
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center border-4 border-black shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl font-black text-white">
                    {rank}
                  </span>
                </div>

                {/* Team Name */}
                <div className="ml-8 flex items-center justify-between">
                  <h3 className="text-2xl md:text-4xl font-black text-white tracking-wider uppercase group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-red-400 group-hover:to-white transition-all duration-300">
                    {team}
                  </h3>
                  
                  {/* Decorative Arrow */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:translate-x-2">
                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                
                {/* Top 3 Special Effects */}
                {rank <= 3 && (
                  <>
                    <div className="absolute top-0 right-0 p-4">
                      <div className={`w-3 h-3 rounded-full ${rank === 1 ? 'bg-yellow-400' : rank === 2 ? 'bg-gray-300' : 'bg-amber-600'} animate-pulse shadow-lg`}></div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/5 to-transparent rounded-2xl"></div>
                  </>
                )}

                {/* Animated Background Lines */}
                <div className="absolute inset-0 overflow-hidden rounded-2xl">
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-red-500/30 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <div className="absolute bottom-0 right-0 w-full h-0.5 bg-gradient-to-l from-transparent via-red-500/30 to-transparent transform translate-x-full group-hover:-translate-x-full transition-transform duration-1000"></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Decoration */}
      <div className="flex justify-center mt-16 space-x-2">
        <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce"></div>
        <div className="w-3 h-3 bg-white rounded-full animate-bounce delay-100"></div>
        <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce delay-200"></div>
      </div>

      {/* Floating Elements */}
      <div className="fixed top-20 left-10 w-2 h-2 bg-red-500 rounded-full animate-pulse opacity-30"></div>
      <div className="fixed bottom-32 right-16 w-1 h-1 bg-white rounded-full animate-pulse opacity-40"></div>
      <div className="fixed top-1/2 right-8 w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse opacity-25"></div>
    </div>
  );
};

export default Rankings;