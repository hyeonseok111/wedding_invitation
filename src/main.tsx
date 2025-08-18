import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // 사용 중이면 유지

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
