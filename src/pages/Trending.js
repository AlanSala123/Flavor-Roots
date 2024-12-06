import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, query, orderBy, where, limit, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { CirclePlus } from "lucide-react";
import Loading from "./Loading";
import { Notebook } from "lucide-react";

function Trending({ userId }) {
    const [recipes, setRecipes] = useState([]);
    const [filteredRecipes, setFilteredRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [firstName, setFirstName] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [topBranches, setTopBranches] = useState([]); // Top branches state
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTrendingRecipes = async () => {
            try {
                const now = new Date();
                const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

                const recipesRef = collection(db, "recipes");
                const recipesQuery = query(
                    recipesRef,
                    orderBy("createdAt"),
                    where("createdAt", ">=", twentyFourHoursAgo)
                );
                const querySnapshot = await getDocs(recipesQuery);

                const fetchedRecipes = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                fetchedRecipes.sort((a, b) => (b.likes || 0) - (a.likes || 0));
                setRecipes(fetchedRecipes);
                setFilteredRecipes(fetchedRecipes);
            } catch (error) {
                console.error("Error fetching trending recipes:", error);
            }
        };

        const fetchTopBranches = async () => {
            try {
                const branchesRef = collection(db, "branches");
                const querySnapshot = await getDocs(branchesRef);
                const fetchedBranches = querySnapshot.docs.map((doc) => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        ...data,
                        recipeCount: data.recipes?.length || 0,
                    };
                });
                const sortedBranches = fetchedBranches.sort((a, b) => b.recipeCount - a.recipeCount);
                const topBranches = sortedBranches.slice(0, 5);
                setTopBranches(topBranches);
            } catch (error) {
                console.error("Error fetching top branches:", error);
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
                    }
                } catch (error) {
                    console.error("Error fetching user first name:", error);
                }
            }
        };

        fetchTrendingRecipes();
        fetchTopBranches(); // Fetch top branches
        fetchUserFirstName();
        setLoading(false);
    }, [userId]);

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
                    <button className="branches-nav-button" onClick={() => navigate("/branches")}>
                        Branches
                    </button>
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
                    <h3>Most Posted Branches</h3>
                    {topBranches.map((branch) => (
                        <button
                            key={branch.id}
                            className="branch-button"
                            onClick={() => navigate(`/branches/${branch.id}`)}
                        >
                            <span className="branch-country">{branch.country}</span>
                            <div className="branch-info">
                                <Notebook className="notebook-icon" />
                                <span className="branch-recipe-count">{branch.recipeCount}</span>
                            </div>
                        </button>
                    ))}
                </aside>
                <section className="post-feed">
                    {filteredRecipes.length === 0 ? (
                        <p>No recipes found</p>
                    ) : (
                        filteredRecipes.map((recipe) => (
                            <Link to={`/recipe/${recipe.id}`} key={recipe.id} className="post-link">
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

export default Trending;
