import React, { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs, doc, getDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import "../styles/Home.css";
import Loading from "./Loading";
import { CirclePlus } from 'lucide-react';

function Home({ userId, onLogout }) {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [userFollowedBranches, setUserFollowedBranches] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
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
        setFilteredRecipes(fetchedRecipes); // Initialize filtered recipes
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

    const fetchUserFollowedBranches = async () => {
      if (userId) {
        try {
          const userDocRef = doc(db, "users", userId);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            const followedBranchIds = userData.followed_branches || [];

            // Fetch branch details for each branchId
            const branchPromises = followedBranchIds.map(async (branchId) => {
              const branchDocRef = doc(db, "branches", branchId);
              const branchDoc = await getDoc(branchDocRef);
              return branchDoc.exists() ? { id: branchId, ...branchDoc.data() } : null;
            });

            const branchDetails = await Promise.all(branchPromises);
            setUserFollowedBranches(branchDetails.filter(Boolean));
          }
        } catch (error) {
          console.error("Error fetching user's followed branches:", error);
        }
      }
    };

    fetchRecipes();
    fetchUserFirstName();
    fetchUserFollowedBranches();
  }, [userId]);

  // Update filtered recipes when search query changes
  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = recipes.filter((recipe) =>
      recipe.recipeName.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredRecipes(filtered);
  }, [searchQuery, recipes]);

  const handleBranchClick = () => {
    navigate("/branches");
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
          <button className="nav-button" onClick={()=>navigate("/trending")}>Trending</button>
          <button className="nav-button" onClick={handleBranchClick}>
            Branches
          </button>
        </nav>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search Recipes"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // Update search query state
          />
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
          {userId ? ( // Check if userId is present
            userFollowedBranches.length === 0 ? (
              <p>No Followed Branches</p>
            ) : (
              userFollowedBranches.map((branch) => (
                <button
                  key={branch.id}
                  className="branch-button"
                  onClick={() => navigate(`/branches/${branch.id}`)}
                >
                  {branch.country}
                </button>
              ))
            )
          ) : (
            <p>Sign in to view</p>
          )}
        </aside>

        <section className="post-feed">
          {filteredRecipes.length === 0 ? (
            <p>No recipes found</p>
          ) : (
            filteredRecipes.map((recipe) => (
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
