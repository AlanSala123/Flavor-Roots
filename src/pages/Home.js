// src/pages/Home.js
import React from "react";
import { useNavigate } from "react-router-dom";

function Home({ username, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/login", { replace: true });
  };

  return (
    <div>
      <h2>Welcome to your Home Page!</h2>
      {username ? <p>Logged in as: {username}</p> : <p>Loading user data...</p>}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Home;
