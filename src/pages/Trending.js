import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, query, orderBy, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { CirclePlus } from 'lucide-react';
import Loading from "./Loading";

function Trending({ userId }) {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [firstName, setFirstName] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTrendingRecipes = async () => {
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
    }, []);

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
                    {recipes.map((recipe) => (
                        <div key={recipe.id} className="post">
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
                    ))}
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
