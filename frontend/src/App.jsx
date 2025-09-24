import React from "react";
import { Routes, Route } from "react-router-dom";
import RegionNavbar from "./RegionNavbar";
import Events from "./Events"
import EventDetails from "./EventDetails";
import Matches from "./Matches"; // Import the Matches component
import Rankings from "./Rankings";


function App() {
  return (
    <div>
      <Routes>
        <Route path="rankings" element={<RegionNavbar />}>
          <Route path=":id" element={<Rankings />} />
          
          <Route path="matches/:id" element={<Matches />} />
        </Route>
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

