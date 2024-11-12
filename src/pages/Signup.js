// src/pages/Signup.js
import React, { useState } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import bcrypt from "bcryptjs";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      alert("Passwords do not match. Please try again.");
      return;
    }

    const usersCollection = collection(db, "users");

    // Check if the username already exists
    const q = query(usersCollection, where("username", "==", username));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      alert("Username already exists. Please choose a different one.");
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Add the new user to Firestore
    await addDoc(usersCollection, {
      username: username,
      password: hashedPassword,
    });

    alert("Signup successful! Please log in.");
    navigate("/login");
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>

      {/* Link to the login page */}
      <p>Already have an account? <Link to="/login">Log in here</Link></p>
    </div>
  );
}

export default Signup;
