// src/pages/Loading.js
import React from "react";
import "../styles/Loading.css"; // Updated import to reflect new location

function Loading() {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <h2 className="loading-text">Flavor Roots</h2>
      <p className="loading-subtext">Loading, please wait...</p>
    </div>
  );
}

export default Loading;
