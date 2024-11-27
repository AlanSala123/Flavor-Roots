import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc, getDocs, collection } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import Loading from './Loading';
import '../styles/BranchDetail.css';

function BranchDetail() {
    const { branchId } = useParams();
    const [branch, setBranch] = useState(null);
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBranchAndRecipes = async () => {
            try {
                // Fetch branch details
                const branchDocRef = doc(db, "branches", branchId);
                const branchDoc = await getDoc(branchDocRef);

                if (branchDoc.exists()) {
                    const branchData = branchDoc.data();
                    setBranch(branchData);

                    // Fetch recipes by IDs
                    const recipePromises = branchData.recipes.map((recipeId) =>
                        getDoc(doc(db, "recipes", recipeId))
                    );

                    const recipeDocs = await Promise.all(recipePromises);
                    const fetchedRecipes = recipeDocs
                        .filter((doc) => doc.exists())
                        .map((doc) => ({ id: doc.id, ...doc.data() }));

                    setRecipes(fetchedRecipes);
                } else {
                    console.error("Branch not found!");
                }
            } catch (error) {
                console.error("Error fetching branch and recipes:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBranchAndRecipes();
    }, [branchId]);

    if (loading) {
        return <Loading />;
    }

    if (!branch) {
        return <p>Branch not found!</p>;
    }

    return (
        <div className="branch-detail-container">
            <header className="branch-detail-header">
                <h1>{branch.country} Recipes</h1>
            </header>

            <section className="branch-detail-recipes">
                {recipes.length > 0 ? (
                    recipes.map((recipe) => (
                        <div key={recipe.id} className="branch-detail-card">
                            <Link to={`/recipe/${recipe.id}`} className="branch-detail-link">
                                <div className="branch-detail-card-image">
                                    <img src={recipe.imageUrl} alt={recipe.name} />
                                </div>
                                <div className="branch-detail-card-content">
                                    <h3>{recipe.recipeName}</h3>
                                    <p>{recipe.caption}</p>
                                </div>
                            </Link>
                        </div>
                    ))
                ) : (
                    <p>No recipes available for this branch.</p>
                )}
            </section>
            <button className="back-button" onClick={() => navigate("/branches")}>Back</button>
        </div>
    );
}

export default BranchDetail;
