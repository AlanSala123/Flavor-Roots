import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import "../styles/RecipeDetail.css";

function RecipeDetail({ userId }) {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const docRef = doc(db, "recipes", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setRecipe(docSnap.data());
                } else {
                    console.log("No such recipe!");
                }
            } catch (error) {
                console.error("Error fetching recipe: ", error);
            }
        };

        fetchRecipe();
    }, [id]);

    const handleBackClick = () => {
        navigate("/home"); 
    };

    if (!recipe) {
        return <div>Loading...</div>;
    }

    return (
        <div className="recipe-detail-container">
            <div className="recipe-card">
                <img src={recipe.imageUrl} alt={recipe.recipeName} />
                <div className="recipe-card-content">
                    <h3>{recipe.recipeName}</h3>
                    <p><strong>Caption:</strong> {recipe.caption}</p>
                    <p><strong>Recipe:</strong> {recipe.recipe}</p>
                    <p><strong>Branch:</strong> {recipe.branchName}</p>
                    <p><strong>Likes:</strong> {recipe.likes ?? 0}</p>
                </div>
            </div>
            <button className="back-button" onClick={handleBackClick}>Back</button>
        </div>
    );
}

export default RecipeDetail;
