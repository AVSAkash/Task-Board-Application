import React from "react";
import { Routes, Route } from "react-router-dom";
import BoardView from "./components/BoardView";
import BoardDetail from "./pages/BoardDetail";

function App() {
  return (
    // Set up the application's routes.
    <Routes>
      {/* The root path displays the list of all boards. */}
      <Route path="/" element={<BoardView />} />
      {/* A dynamic path to display the details of a specific board. */}
      <Route path="/board/:id" element={<BoardDetail/>} />
    </Routes>
  );
}

export default App;
