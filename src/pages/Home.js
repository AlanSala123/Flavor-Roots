// src/pages/Home.js
import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Flavor Roots</h1>
        <nav className="nav-bar">
          <button className="nav-button active">Home</button>
          <button className="nav-button">Trending</button>
          <button className="nav-button">Branches</button>
        </nav>
        <div className="search-bar">
          <input type="text" placeholder="Search" />
        </div>
        <Link to="/profile">
          <button className="profile-button">Profile</button>
        </Link>
      </header>

      <div className="content">
        <aside className="followed-branches">
          <h3>Followed Branches listed:</h3>
          <button className="branch-button">Italian</button>
          <button className="branch-button">French</button>
          <button className="branch-button">Spanish</button>
        </aside>

        <section className="post-feed">
          {[...Array(5)].map((_, index) => (
            <div className="post" key={index}>
              <div className="post-content">
                <p>This is a post caption along with its branch and tags</p>
              </div>
              <div className="post-image-placeholder">Small post image</div>
            </div>
          ))}
        </section>
      </div>

      <div className="post-button-div">
        <Link to="/post">
          <button className="post-button">Post Recipe</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
