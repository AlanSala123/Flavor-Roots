// src/pages/Login.js
import React, { useState } from "react";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import bcrypt from "bcryptjs";
import { useNavigate, Link } from "react-router-dom";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const usersCollection = collection(db, "users");

    // Check if username exists
    const q = query(usersCollection, where("username", "==", username));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      alert("Invalid username or password");
      return;
    }

    // Get stored hashed password
    const userDoc = querySnapshot.docs[0];
    const storedHashedPassword = userDoc.data().password;
    const userId = userDoc.id;

    // Compare entered password with stored hashed password
    const isPasswordCorrect = await bcrypt.compare(password, storedHashedPassword);
    if (isPasswordCorrect) {
      // Call the `onLogin` function from `App.js` and pass the userId and username
      onLogin(userId, username);
      navigate("/home", { replace: true });
    } else {
      alert("Invalid username or password");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
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
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <Link to="/signup">Sign up here</Link></p>
    </div>
  );
}

export default Login;
