// src/App.js
import React, { useEffect, useState } from "react";
import { auth } from "./firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe; // Unsubscribe when component unmounts
  }, []);

  return (
    <div>
      <h1>Welcome to Flavor Roots</h1>
      {user ? <p>Welcome, {user.email}</p> : <p>Please log in</p>}
    </div>
  );
}

export default App;
