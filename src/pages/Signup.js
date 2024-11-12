// src/pages/Signup.js
import React, { useState } from "react";
import { db } from "../firebaseConfig"; // No need to import storage
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import bcrypt from "bcryptjs";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Signup.css";

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profilePicture, setProfilePicture] = useState(null); // File for profile picture
  const navigate = useNavigate();

  // Function to convert an image file to base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
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

    // Encode the profile picture to base64 if it exists
    let profilePictureBase64 = "";
    if (profilePicture) {
      profilePictureBase64 = await convertToBase64(profilePicture);
    }

    // Add the new user to Firestore with the encoded image
    await addDoc(usersCollection, {
      username: username,
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName,
      profilePicture: profilePictureBase64,
    });

    alert("Signup successful! Please log in.");
    navigate("/login");
  };

  return (
    <div className="signup-container">
      <h2 className="signup-header">Sign Up</h2>
      <form className="signup-form" onSubmit={handleSignup}>
        <input
          type="text"
          className="signup-input"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <input
          type="text"
          className="signup-input"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <input
          type="text"
          className="signup-input"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          className="signup-input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="file"
          className="signup-input"
          onChange={(e) => setProfilePicture(e.target.files[0])}
        />
        <button type="submit" className="signup-button">Sign Up</button>
      </form>
      <Link to="/login" className="login-link">Already have an account? Login here</Link>
    </div>
  );
}

export default Signup;
