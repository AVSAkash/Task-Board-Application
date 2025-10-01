import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { BoardProvider } from "./context/BoardContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BoardProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </BoardProvider>
  </React.StrictMode>
);
