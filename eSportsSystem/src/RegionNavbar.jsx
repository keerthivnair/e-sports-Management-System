import React from "react";
import { Link, Outlet } from "react-router-dom";

const RegionNavbar = () => {
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
    { key: "col", name: "Collegiate", flag: "🎓" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-950">
      {/* Hero Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-transparent"></div>
        <div className="relative z-10 text-center py-16 px-4">
          <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-white to-red-400 tracking-wider mb-6 drop-shadow-2xl animate-pulse">
            VALORANT
          </h1>
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-widest uppercase mb-4">
            Regional Rankings
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-red-500 to-white mx-auto rounded-full"></div>
        </div>
        
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-10 w-16 h-16 border-2 border-red-500/30 rotate-45 animate-pulse"></div>
        <div className="absolute bottom-20 right-16 w-8 h-8 bg-white/10 rotate-12 animate-bounce"></div>
        <div className="absolute top-1/2 right-20 w-12 h-12 border border-white/20 rounded-full animate-ping"></div>
      </div>

      {/* Region Selection Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            SELECT YOUR REGION
          </h3>
          <div className="w-24 h-0.5 bg-red-500 mx-auto"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4 md:gap-6">
          {shortNames.map(({ key, name, flag }, index) => (
            <Link key={key} to={`/rankings/${key}`}>
              <div
                className="group relative cursor-pointer transform transition-all duration-500 hover:scale-110 hover:-translate-y-2"
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                {/* Main Card */}
                <div className="relative bg-gradient-to-br from-gray-900 via-black to-gray-800 border-2 border-gray-700 hover:border-red-400 rounded-xl p-4 md:p-6 h-32 md:h-40 flex flex-col items-center justify-center transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/30">
                  {/* Flag/Icon */}
                  <div className="text-3xl md:text-4xl mb-2 group-hover:scale-125 transition-transform duration-300">
                    {flag}
                  </div>

                  {/* Region Name */}
                  <h4 className="text-sm md:text-base font-black tracking-wider text-center uppercase text-white group-hover:text-red-400 transition-all duration-300">
                    {name}
                  </h4>

                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Corner Accents */}
                  <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-red-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-red-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Animated Border Lines */}
                  <div className="absolute inset-0 overflow-hidden rounded-xl">
                    <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-red-500/60 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    <div className="absolute bottom-0 right-0 w-full h-0.5 bg-gradient-to-l from-transparent via-red-500/60 to-transparent transform translate-x-full group-hover:-translate-x-full transition-transform duration-1000"></div>
                  </div>
                </div>

                {/* Floating Highlight */}
                <div className="absolute -inset-1 bg-gradient-to-r from-red-500 via-transparent to-red-500 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10"></div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom Decorative Elements */}
      <div className="flex justify-center pb-8 space-x-4">
        <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-100"></div>
        <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce delay-200"></div>
        <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-300"></div>
        <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce delay-500"></div>
      </div>

      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 border border-red-500/5 rounded-full animate-spin-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 border border-white/5 rounded-full animate-reverse-spin"></div>
      </div>

      {/* Outlet for nested routes */}
      <Outlet />

      <style jsx>{`
        @keyframes spin-slow {
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes reverse-spin {
          to {
            transform: rotate(-360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .animate-reverse-spin {
          animation: reverse-spin 25s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default RegionNavbar;