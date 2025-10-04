import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import RegionNavbar from "./RegionNavbar";
import Events from "./Events"
import EventDetails from "./EventDetails";
import Matches from "./Matches"; // Import the Matches component
import Rankings from "./Rankings";
import Login from "./Login";
import Recommend from "./Rec";
import Stats from "./stats";
import Navbar from "./Navbar";
import TeamDetails from "./TeamDetails";


function App() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/";

  return (
    <div>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/recommendations" element={<Recommend/>}/>
        <Route path="/stats" element={<Stats/>}/>
        <Route path="/rankings" element={<RegionNavbar />}>
          <Route path=":id" element={<Rankings />} />
        </Route>
        <Route path="/team/:teamName" element={<TeamDetails />} />
        <Route path="/matches/:id" element={<Matches />} />
       
        {/* Events page */}
        <Route path="/events" element={<Events />} />
        {/* Event details page */}
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="*" element={<h1>Coming soon</h1>} />
      </Routes>
    </div>
  );
}

export default App;
