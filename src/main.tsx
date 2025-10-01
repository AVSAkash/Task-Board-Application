import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { BoardProvider } from "./context/BoardContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* BoardProvider makes the board state available to the entire app. */}
    <BoardProvider>
      {/* BrowserRouter enables client-side routing. */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </BoardProvider>
  </React.StrictMode>
);
