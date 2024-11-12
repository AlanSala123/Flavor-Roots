// src/pages/Login.js
import React, { useState } from "react";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import bcrypt from "bcryptjs";
import { useNavigate, Link } from "react-router-dom";
import Cookies from "js-cookie";
import "../styles/Login.css";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const usersCollection = collection(db, "users");

    // Query Firestore for the user with the specified username
    const q = query(usersCollection, where("username", "==", username));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      alert("Invalid username or password");
      return;
    }

    // Retrieve user document and check the password
    const userDoc = querySnapshot.docs[0];
    const storedHashedPassword = userDoc.data().password;
    const userId = userDoc.id; // or any unique identifier for the user

    // Compare the entered password with the stored hashed password
    const isPasswordCorrect = await bcrypt.compare(password, storedHashedPassword);
    if (isPasswordCorrect) {
      // Set a session cookie with userId (or a session token)
      Cookies.set("session", userId, { expires: 1 }); // Expires in 1 day
      onLogin(userId); // Call the onLogin function to update the app state
      navigate("/home");
    } else {
      alert("Invalid username or password");
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-header">Login</h2>
      <form className="login-form" onSubmit={handleLogin}>
        <input
          type="text"
          className="login-input"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          className="login-input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="login-button">Login</button>
      </form>
      <Link to="/signup" className="signup-link">Don't have an account? Sign up here</Link>
    </div>
  );
}

export default Login;
