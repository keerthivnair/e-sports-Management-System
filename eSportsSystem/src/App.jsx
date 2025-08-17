import "./App.css";
import Rankings from "./Rankings";
import { Routes, Route, Navigate } from "react-router-dom";
import RegionNavbar from "./RegionNavbar";

function App() {
  return (
    <div>
      <Routes>
        <Route path="rankings" element={<RegionNavbar />}>
          <Route path=":id" element={<Rankings />} />
        </Route>
        <Route path="*" element={<h1>Coming soon</h1>} />
      </Routes>
    </div>
  );
}

export default App;
