// src/pages/Profile.js
import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "../styles/Profile.css";
import Loading from "./Loading";

function Profile({ userId }) {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, "users", userId);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleLogout = () => {
    Cookies.remove("session");
    navigate("/login");
    window.location.reload();
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        await deleteDoc(doc(db, "users", userId));
        Cookies.remove("session");
        alert("Your account has been deleted.");
        navigate("/signup");
      } catch (error) {
        console.error("Error deleting account:", error);
        alert("There was an error deleting your account. Please try again.");
      }
    }
  };

  const handleBackClick = () => {
    navigate("/home"); 
};

  if (!userData) {
    return <Loading />;
  }

  return (
    <div className="profile-container">
      <h2>Profile</h2>
      <div className="profile-info">
        <img
          src={userData.profilePicture}
          alt="Profile"
          className="profile-picture"
        />
        <div className="profile-details">
          <p><strong>First Name:</strong> {userData.firstName}</p>
          <p><strong>Last Name:</strong> {userData.lastName}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Username:</strong> {userData.username}</p>
        </div>
        <button className="previous-posts-button">Previous Posts</button>
        <button onClick={handleLogout} className="logout-button">Log Out</button>
        <button onClick={handleDeleteAccount} className="delete-button">Delete Account</button>
      </div>
      <button className="back-button" onClick={handleBackClick}>Back</button>
    </div>
  );
}

export default Profile;
