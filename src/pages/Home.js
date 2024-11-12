// src/pages/Home.js
import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import "../styles/Home.css";
import Loading from "./Loading";

function Home({ userId, onLogout }) {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        try {
          const userDocRef = doc(db, "users", userId);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            setUserData(userDoc.data());
          } else {
          }
        } catch (error) {
        }
      }
    };

    fetchUserData();
  }, [userId]);

  if (!userData) {
    return <Loading />;
  }

  return (
    <div className="home-container">
      <h2 className="home-header">Welcome to Flavor Roots, {userData.firstName}!</h2>
      {userData.profilePicture ? (
        <img src={userData.profilePicture} alt="Profile" className="profile-picture" />
      ) : (
        <div className="profile-placeholder">No Profile Picture</div>
      )}
      <p className="home-username">Name: {userData.firstName} {userData.lastName}</p>
      <p className="home-username">Username: {userData.username}</p>
      <button className="home-logout-button" onClick={onLogout}>Logout</button>
    </div>
  );
}

export default Home;
