// src/App.js
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Cookies from "js-cookie";
import { db } from "./firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState(null);

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
    };

    checkUserSession();
  }, []);

  const handleLogin = (userId, userName) => {
    Cookies.set("session", userId, { expires: 1 });
    setUsername(userName);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    Cookies.remove("session");
    setIsLoggedIn(false);
    setUsername(null);
  };

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
