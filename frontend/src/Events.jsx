import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Events = () => {
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [completedEvents, setCompletedEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState("upcoming");

  const regions = [
    { key: "all", name: "All", flag: "🌍" },
    { key: "us", name: "North America", flag: "🇺🇸" },
    { key: "eu", name: "Europe", flag: "🇪🇺" },
    { key: "br", name: "Brazil", flag: "🇧🇷" },
    { key: "ap", name: "Asia-Pacific", flag: "🌏" },
    { key: "kr", name: "Korea", flag: "🇰🇷" },
    { key: "jp", name: "Japan", flag: "🇯🇵" },
    { key: "la", name: "Latin America", flag: "🌎" },
    { key: "au", name: "Oceania", flag: "🇦🇺" },
    { key: "mn", name: "MENA", flag: "🌍" },
  ];

  async function fetchEvents(status) {
    try {
      const res = await fetch(`http://localhost:3000/events/${status}`);
      const json = await res.json();
      if (status === "completed") setCompletedEvents(json);
      if (status === "upcoming") setUpcomingEvents(json);
      setIsLoading(false);
    } catch (error) {
      console.error(`Error fetching ${status} events:`, error);
    }
  }

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      await Promise.all([fetchEvents("completed"), fetchEvents("upcoming")]);
    }
    loadData();
  }, []);

  const filterByRegion = (events) => {
    if (selectedRegion === "all") return events;
    return events.filter((e) => e.region?.toLowerCase() === selectedRegion.toLowerCase());
  };

  const filteredCompleted = filterByRegion(completedEvents);
  const filteredUpcoming = filterByRegion(upcomingEvents);

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-red-950">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-white to-red-400 tracking-wider">
            LOADING EVENTS
          </h1>
        </div>
      </div>
    );

  const EventCard = ({ event, index }) => (
    <Link
      to={`/events/${encodeURIComponent(event.title)}`}
      state={{ view }}
      className="group relative bg-gradient-to-r from-black via-gray-900 to-black border-2 border-gray-800 hover:border-red-500 rounded-2xl p-6 md:p-8 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-red-500/20 transform hover:-translate-y-1 cursor-pointer block"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {event.thumb && (
        <img
          src={event.thumb}
          alt={event.title}
          className="w-full h-40 object-contain mb-4 rounded-lg"
        />
      )}
      <h4 className="text-xl md:text-2xl font-black text-white uppercase group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-red-400 group-hover:to-white transition-all duration-300 mb-2">
        {event.title}
      </h4>
      <p className="text-sm text-gray-400 mb-1">
        📅 <span className="text-white">{event.dates}</span>
      </p>
      <p className="text-sm text-gray-400 mb-1">
        🗺️ <span className="text-white">{event.region}</span>
      </p>
      {event.prize && (
        <p className="text-sm text-gray-400">
          💰 <span className="text-yellow-400 font-bold">{event.prize}</span>
        </p>
      )}
    </Link>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-950">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-transparent"></div>
        <div className="relative z-10 text-center py-16 px-4">
          <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-white to-red-400 mb-6 animate-pulse">
            EVENTS
          </h1>
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-widest uppercase mb-4">
            Esports Tournaments
          </h2>
        </div>
      </div>

      {/* Region Selection */}
      <div className="max-w-7xl mx-auto px-4 pb-10">
        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">SELECT REGION</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {regions.map(({ key, name, flag }, index) => (
            <div
              key={key}
              onClick={() => setSelectedRegion(key)}
              className={`cursor-pointer rounded-xl p-6 text-center transition-all ${
                selectedRegion === key
                  ? "border-red-500 border-2"
                  : "border border-gray-700 hover:border-red-400"
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-3xl">{flag}</div>
              <h4 className="text-white mt-2">{name}</h4>
            </div>
          ))}
        </div>
      </div>

      {/* Toggle Upcoming / Completed */}
      <div className="flex justify-center mb-10 space-x-6">
        <button
          onClick={() => setView("upcoming")}
          className={`px-6 py-2 rounded-lg font-bold uppercase ${
            view === "upcoming"
              ? "bg-red-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-red-500 hover:text-white"
          }`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setView("completed")}
          className={`px-6 py-2 rounded-lg font-bold uppercase ${
            view === "completed"
              ? "bg-red-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-red-500 hover:text-white"
          }`}
        >
          Completed
        </button>
      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto grid gap-12 px-4 pb-16">
        {view === "upcoming" ? (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 border-l-4 border-red-500 pl-3">
              Upcoming Events
            </h2>
            {filteredUpcoming.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-8">
                {filteredUpcoming.map((event, idx) => (
                  <EventCard key={idx} event={event} index={idx} />
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No upcoming events.</p>
            )}
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 border-l-4 border-red-500 pl-3">
              Completed Events
            </h2>
            {filteredCompleted.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-8">
                {filteredCompleted.map((event, idx) => (
                  <EventCard key={idx} event={event} index={idx} />
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No completed events.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
