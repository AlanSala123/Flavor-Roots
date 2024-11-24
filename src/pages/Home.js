import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig"; 
import "../styles/Home.css";

function Home() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

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

    fetchRecipes();
  }, []);

  if (loading) {
    return <div>Loading recipes...</div>;
  }

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Flavor Roots</h1>
        <nav className="nav-bar">
          <button className="nav-button active">Home</button>
          <button className="nav-button">Trending</button>
          <button className="nav-button">Branches</button>
        </nav>
        <div className="search-bar">
          <input type="text" placeholder="Search" />
        </div>
        <Link to="/profile">
          <button className="profile-button">Profile</button>
        </Link>
      </header>

      <div className="content">
        <aside className="followed-branches">
          <h3>Followed Branches listed:</h3>
          <button className="branch-button">Italian</button>
          <button className="branch-button">French</button>
          <button className="branch-button">Spanish</button>
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
          <button className="post-button">Post Recipe</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
