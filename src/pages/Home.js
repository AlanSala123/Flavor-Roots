// src/pages/Home.js
import React from "react";
import "../styles/Home.css";

function Home({ username, onLogout }) {
  return (
    <div className="home-container">
      <h2 className="home-header">Welcome to Flavor Roots</h2>
      <p className="home-username">Logged in as: {username}</p>
      <button className="home-logout-button" onClick={onLogout}>Logout</button>
    </div>
  );
}

export default Home;
