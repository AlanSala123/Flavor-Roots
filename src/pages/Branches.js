import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, query, orderBy, getDocs, doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../firebaseConfig";
import "../styles/Branches.css";
import Loading from "./Loading";
import { Notebook, SquarePlus, SquareMinus } from 'lucide-react';

function Branches({ userId }) {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [firstName, setFirstName] = useState("");
    const [userFollowedBranches, setUserFollowedBranches] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const branchesRef = collection(db, "branches");
                const branchesQuery = query(branchesRef, orderBy("createdAt", "desc"));
                const querySnapshot = await getDocs(branchesQuery);

                const fetchedBranches = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setRecipes(fetchedBranches);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching branches:", error);
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

        fetchBranches();
        fetchUserFirstName();
        fetchUserFollowedBranches();
    }, [userId]);

    const fetchUserFollowedBranches = async () => {
        if (userId) {
            try {
                const userDocRef = doc(db, "users", userId);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setUserFollowedBranches(userData.followed_branches || []);
                }
            } catch (error) {
                console.error("Error fetching user's followed branches:", error);
            }
        }
    };

    const handleIconClick = async (branchId, isFollowing) => {
        const userDocRef = doc(db, "users", userId);
        try {
            if (isFollowing) {
                // Remove the branch from followed_branches
                await updateDoc(userDocRef, {
                    followed_branches: arrayRemove(branchId),
                });
            } else {
                // Add the branch to followed_branches
                await updateDoc(userDocRef, {
                    followed_branches: arrayUnion(branchId),
                });
            }

            // After updating the database, fetch the updated followed branches
            fetchUserFollowedBranches();
        } catch (error) {
            console.error("Error updating followed branches:", error);
        }
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="branches-container">
            <header className="branches-header">
                <h1>Flavor Roots</h1>
                <nav className="branches-nav-bar">
                    <button className="branches-nav-button" onClick={() => navigate("/home")}>Home</button>
                    <button className="branches-nav-button">Trending</button>
                    <button className="branches-nav-button active">Branches</button>
                </nav>
                <div className="branches-search-bar">
                    <input type="text" placeholder="Search Branches" />
                </div>
                <Link to={userId ? "/profile" : "/login"}>
                    <button className="branches-profile-button">
                        {userId ? `Hi, ${firstName}` : "Sign In"}
                    </button>
                </Link>
            </header>

            <div className="branches-content">
                <aside className="branches-followed-branches">
                    <h3>Followed Branches</h3>
                    <div className="followed-branches-buttons">
                        {userFollowedBranches.length === 0 ? (
                            <p>No Followed Branches</p>
                        ) : (
                            userFollowedBranches.map((followedBranchId) => {
                                const followedBranch = recipes.find(branch => branch.id === followedBranchId);
                                return followedBranch ? (
                                    <button
                                        key={followedBranch.id}
                                        className="branch-button"
                                        onClick={() => navigate(`/branches/${followedBranch.id}`)}
                                    >
                                        {followedBranch.country}
                                    </button>
                                ) : null;
                            })
                        )}
                    </div>
                </aside>
                <section className="branches-post-feed">
                    {recipes.map((branch) => {
                        const isFollowing = userFollowedBranches.includes(branch.id);
                        return (
                            <div key={branch.id} className="branches-branch-card">
                                <Link to={`/branches/${branch.id}`} className="branch-link">
                                    {/* Recipe Count Badge */}
                                    <div className="branches-recipe-count">
                                        <Notebook size={16} className="branches-recipe-icon" />
                                        <span>{branch.recipes?.length}</span>
                                    </div>

                                    {/* Main Card Content */}
                                    <div className="branches-branch-card-content">
                                        <h4 className="branches-branch-country">{branch.country}</h4>
                                    </div>
                                </Link>
                                {/* Square Icon Button */}
                                <button
                                    className="branches-square-plus"
                                    onClick={() => handleIconClick(branch.id, isFollowing)}
                                >
                                    {isFollowing ? (
                                        <SquareMinus size={24} />
                                    ) : (
                                        <SquarePlus size={24} />
                                    )}
                                </button>
                            </div>
                        );
                    })}
                </section>
            </div>

            <div className="branches-post-button-div">
                <button className="branches-post-button">New Branch</button>
            </div>
        </div>
    );
}

export default Branches;
