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
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserSession = async () => {
      const storedUserId = Cookies.get("session");

      if (storedUserId) {
        try {
          const userDocRef = doc(db, "users", storedUserId);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            setUserId(storedUserId);
            setIsLoggedIn(true);
          } else {
            handleLogout();
          }
        } catch (error) {
          handleLogout();
        }
      } else {
        handleLogout();
      }

      setLoading(false);
    };

    checkUserSession();
  }, []);

  const handleLogin = (userId) => {
    Cookies.set("session", userId, { expires: 1 });
    setUserId(userId);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    Cookies.remove("session");
    setIsLoggedIn(false);
    setUserId(null);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={isLoggedIn ? "/home" : "/login"} />} />
        <Route path="/login" element={isLoggedIn ? <Navigate to="/home" /> : <Login onLogin={handleLogin} />} />
        <Route path="/signup" element={isLoggedIn ? <Navigate to="/home" /> : <Signup />} />
        <Route path="/home" element={isLoggedIn ? <Home userId={userId} onLogout={handleLogout} /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
