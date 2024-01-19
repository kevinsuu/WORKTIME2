// src/index.js
import React from "react";
import App from "./App";
import { createRoot } from "react-dom/client";
import "./index.css"; // Import the reset CSS file

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
