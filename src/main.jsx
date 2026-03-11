import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter basename="/HoopCast">
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

const loader = document.getElementById("app-loader");
if (loader) {
  loader.style.transition = "opacity 0.4s ease";
  loader.style.opacity = "0";
  setTimeout(() => loader.remove(), 400);
}