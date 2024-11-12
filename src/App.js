// src/App.js
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Loading from "./pages/Loading";
import Cookies from "js-cookie";
import { db } from "./firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const checkUserSession = async () => {
      const userId = Cookies.get("session");

      if (userId) {
        const userDocRef = doc(db, "users", userId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUsername(userData.username);
          setIsLoggedIn(true);
        } else {
          handleLogout();
        }
      } else {
        handleLogout();
      }

      setLoading(false); // Set loading to false after checking the session
    };

    checkUserSession();
  }, []);

  const handleLogin = (userId, userName) => {
    Cookies.set("session", userId, { expires: 1 });
    setUsername(userName);
    setIsLoggedIn(true);
    setLoading(false); // Ensure loading is false after login
  };

  const handleLogout = () => {
    Cookies.remove("session");
    setIsLoggedIn(false);
    setUsername(null);
    setLoading(false); // Ensure loading is false after logout
  };

  if (loading) {
    return <Loading />; // Render loading page while session check is ongoing
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={isLoggedIn ? "/home" : "/login"} />} />
        <Route path="/login" element={isLoggedIn ? <Navigate to="/home" /> : <Login onLogin={handleLogin} />} />
        <Route path="/signup" element={isLoggedIn ? <Navigate to="/home" /> : <Signup />} />
        <Route path="/home" element={isLoggedIn ? <Home username={username} onLogout={handleLogout} /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
