import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, query, orderBy, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { CirclePlus } from 'lucide-react';
import Loading from "./Loading";

function Trending({ userId }) {
    const [recipes, setRecipes] = useState([]);
    const [filteredRecipes, setFilteredRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [firstName, setFirstName] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTrendingRecipes = async () => {
            try {
                const now = new Date();
                const twentyFourHoursAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));

                const recipesRef = collection(db, "recipes");
                const recipesQuery = query(
                    recipesRef,
                    where("createdAt", ">=", twentyFourHoursAgo),
                    orderBy("createdAt") // Firestore requires ordering by the field used in where inequality
                );
                const querySnapshot = await getDocs(recipesQuery);

                const fetchedRecipes = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                // Sort the recipes by likes in descending order
                fetchedRecipes.sort((a, b) => (b.likes || 0) - (a.likes || 0));

                setRecipes(fetchedRecipes);
                setFilteredRecipes(fetchedRecipes); // Initialize filtered recipes
                setLoading(false);
            } catch (error) {
                console.error("Error fetching trending recipes:", error);
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

        fetchTrendingRecipes();
        fetchUserFirstName();
    }, [userId]);

    // Update filtered recipes when search query changes
    useEffect(() => {
        const lowerCaseQuery = searchQuery.toLowerCase();
        const filtered = recipes.filter((recipe) =>
            recipe.recipeName.toLowerCase().includes(lowerCaseQuery)
        );
        setFilteredRecipes(filtered);
    }, [searchQuery, recipes]);

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="branches-container">
            <header className="branches-header">
                <h1>Flavor Roots</h1>
                <nav className="branches-nav-bar">
                    <button className="branches-nav-button" onClick={() => navigate("/home")}>
                        Home
                    </button>
                    <button className="branches-nav-button active">Trending</button>
                    <button className="branches-nav-button" onClick={() => navigate("/branches")}>Branches</button>
                </nav>
                <div className="branches-search-bar">
                    <input
                        type="text"
                        placeholder="Search Trending Recipes"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <button className="branches-profile-button" onClick={() => navigate("/profile")}>
                    {userId ? `Hi, ${firstName}` : "Sign In"}
                </button>
            </header>

            <div className="content">
                <aside className="followed-branches">
                    <h3>Trending Branches</h3>
                    <button className="branch-button">Italy</button>
                    <button className="branch-button">Mexico</button>
                    <button className="branch-button">France</button>
                </aside>
                <section className="post-feed">
                    {filteredRecipes.length === 0 ? (
                        <p>No recipes found</p>
                    ) : (
                        filteredRecipes.map((recipe) => (
                            <div key={recipe.id} className="post">
                                <div className="post-content">
                                    <p>{recipe.recipeName}</p>
                                    <p>{recipe.caption}</p>
                                    <p>Likes: {recipe.likes || 0}</p>
                                </div>
                                <div className="post-image">
                                    <img
                                        src={recipe.imageUrl}
                                        alt={recipe.caption}
                                        className="small-image"
                                    />
                                </div>
                            </div>
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

export default Trending;
