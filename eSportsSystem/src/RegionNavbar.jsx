import React from "react";
import { Link, Outlet } from "react-router-dom";

const RegionNavbar = () => {
  const shortNames = [
    { key: "na", name: "North America" },
    { key: "eu", name: "Europe" },
    { key: "ap", name: "Asia-Pacific" },
    { key: "la-s", name: "LA-S" },
    { key: "la-n", name: "LA-N" },
    { key: "oce", name: "Oceania" },
    { key: "kr", name: "Korea" },
    { key: "mn", name: "MENA" },
    { key: "gc", name: "GC" },
    { key: "br", name: "Brazil" },
    { key: "cn", name: "China" },
    { key: "jp", name: "Japan" },
    { key: "col", name: "Collegiate" },
  ];

  return (
    <div>
      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-13 gap-4 w-screen">
        {shortNames.map(({ key, name }) => (
          <Link key={key} to={`/rankings/${key}`}>
            <h1>{name}</h1>
          </Link>
        ))}
      </div>
      <Outlet />
    </div>
  );
};

export default RegionNavbar;
