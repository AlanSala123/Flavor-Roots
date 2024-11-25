import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, increment } from "firebase/firestore";
import { db } from "../firebaseConfig";
import "../styles/RecipeDetail.css";
import Loading from "./Loading";
import { ThumbsUp } from 'lucide-react';

function RecipeDetail({ userId }) {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [isLiked, setIsLiked] = useState(false);
    const [likeNum, setLikeNum] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const docRef = doc(db, "recipes", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setRecipe(docSnap.data());
                    setLikeNum(docSnap.data().likes || 0)
                } else {
                    console.log("No such recipe!");
                }
            } catch (error) {
                console.error("Error fetching recipe: ", error);
            }
        };

        const fetchUserLikes = async () => {
            try {
                const userRef = doc(db, "users", userId);
                const userDoc = await getDoc(userRef);
                if (userDoc.exists()) {
                    setIsLiked(userDoc.data().likedPosts.includes(id));
                } else {
                    console.log("User not found!");
                }
            } catch (error) {
                console.error("Error fetching user likes: ", error);
            }
        };

        fetchRecipe();
        fetchUserLikes();
    }, [id, userId]);

    const handleBackClick = () => {
        if (location.state?.from === "/post") {
            navigate("/home");
        } else {
            navigate(-1);
        }
    };

    const handleLikeClick = async () => {
        try {
            const userRef = doc(db, "users", userId);
            const userDoc = await getDoc(userRef);
            const recipeRef = doc(db, "recipes", id);

            if (userDoc.data().likedPosts.includes(id)) {
                await updateDoc(userRef, {
                    likedPosts: arrayRemove(id)
                });
                await updateDoc(recipeRef, {
                    likes: increment(-1)
                });
                setLikeNum(likeNum - 1);
                setIsLiked(!isLiked);
            } else {
                await updateDoc(userRef, {
                    likedPosts: arrayUnion(id)
                });
                await updateDoc(recipeRef, {
                    likes: increment(1)
                });
                setLikeNum(likeNum + 1);
                setIsLiked(!isLiked);
            }
        } catch (error) {
            console.error("Error updating liked posts: ", error);
        }
    };

    if (!recipe) {
        return <Loading />;
    }

    return (
        <div className="recipe-detail-container">
            <div className="recipe-card">
                <img src={recipe.imageUrl} alt={recipe.recipeName} className="recipe-card-image" />
                <div className="recipe-card-content">
                    <h3>{recipe.recipeName}</h3>
                    <p><strong>Caption:</strong> {recipe.caption}</p>
                    <p><strong>Recipe:</strong> {recipe.recipe}</p>
                    <p><strong>Branch:</strong> {recipe.branchName}</p>
                    <p><strong>Likes:</strong> {likeNum ?? 0}</p>
                </div>
                <ThumbsUp
                    onClick={handleLikeClick}
                    style={{
                        position: 'absolute',
                        bottom: '20px',
                        right: '20px',
                        cursor: 'pointer',
                        color: isLiked ? '#DFAF3C' : '#DFAF3C',
                        transform: isLiked ? 'scale(1.2)' : 'scale(1)',
                        transition: 'transform 0.3s ease-in-out, color 0.3s ease-in-out',
                        fill: isLiked ? '#DFAF3C' : 'none'
                    }}
                    stroke={isLiked ? 'none' : '#DFAF3C'}
                />
            </div>
            <button className="back-button" onClick={handleBackClick}>Back</button>
        </div>
    );
}

export default RecipeDetail;
