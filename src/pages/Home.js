import React, { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs, doc, getDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import "../styles/Home.css";
import Loading from "./Loading";
import { CirclePlus } from 'lucide-react';

function Home({ userId, onLogout }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const recipesRef = collection(db, "recipes");
        const recipesQuery = query(recipesRef, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(recipesQuery);

        const fetchedRecipes = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setRecipes(fetchedRecipes);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching recipes:", error);
        setLoading(false);
      }
    };

    const fetchUserFirstName = async () => {
      if (userId) {
        try {
          const userDocRef = doc(db, "users", userId);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setFirstName(userData.firstName || "");
          } else {
            console.error("User document does not exist");
          }
        } catch (error) {
          console.error("Error fetching user first name:", error);
        }
      }
    };

    fetchRecipes();
    fetchUserFirstName();
  }, [userId]);

  const handleBranchClick = () => {
    navigate("/branches")
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Flavor Roots</h1>
        <nav className="nav-bar">
          <button className="nav-button active">Home</button>
          <button className="nav-button">Trending</button>
          <button className="nav-button" onClick={handleBranchClick}>Branches</button>
        </nav>
        <div className="search-bar">
          <input type="text" placeholder="Search" />
        </div>
        <Link to={userId ? "/profile" : "/login"}>
          <button className="profile-button">
            {userId ? `Hi, ${firstName}` : "Sign In"}
          </button>
        </Link>
      </header>

      <div className="content">
        <aside className="followed-branches">
          <h3>Followed Branches</h3>
          {userId ? (
            <>
              <button className="branch-button">Italian</button>
              <button className="branch-button">French</button>
              <button className="branch-button">Spanish</button>
            </>
          ) : (
            <p>Sign in to view</p>
          )}
        </aside>

        <section className="post-feed">
          {recipes.length === 0 ? (
            <p>No recipes found</p>
          ) : (
            recipes.map((recipe) => (
              <Link to={`/recipe/${recipe.id}`} key={recipe.id} className="post-link">
                <div className="post">
                  <div className="post-content">
                    <p>{recipe.recipeName}</p>
                    <p>{recipe.caption}</p>
                  </div>
                  <div className="post-image">
                    <img
                      src={recipe.imageUrl}
                      alt={recipe.caption}
                      className="small-image"
                    />
                  </div>
                </div>
              </Link>
            ))
          )}
        </section>
      </div>

      <div className="post-button-div">
        <Link to="/post">
          <button className="post-button">
            <CirclePlus size={32} />
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
