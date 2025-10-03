import React from "react";
import { Routes, Route } from "react-router-dom";
import RegionNavbar from "./RegionNavbar";
import Events from "./Events"
import EventDetails from "./EventDetails";
import Matches from "./Matches"; // Import the Matches component
import Rankings from "./Rankings";
import Login from "./Login";
import Recommend from "./Rec";


function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/recommendations" element={<Recommend/>}/>
        <Route path="rankings" element={<RegionNavbar />}>
          <Route path=":id" element={<Rankings />} />
        </Route>
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

