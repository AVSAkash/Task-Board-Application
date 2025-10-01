import React from "react";
import { Routes, Route } from "react-router-dom";
import BoardView from "./components/BoardView";
import BoardDetail from "./pages/BoardDetail";

function App() {
  return (
    <Routes>
      <Route path="/" element={<BoardView />} />
      <Route path="/board/:id" element={<BoardDetail/>} />
    </Routes>
  );
}

export default App;
