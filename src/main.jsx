import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { preloadCriticalAssets } from "./preloadCriticalAssets";
import "./styles/global.css";

preloadCriticalAssets();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
