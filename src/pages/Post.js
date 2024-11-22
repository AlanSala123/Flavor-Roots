import React from "react";
import {useState} from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Post.css";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

function Post({ userId }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        recipeName: "",
        recipe: "",
        branchName: "",
        caption: "",
        image: null,
        userId: userId
    });

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: files[0]
        }));
    };

     const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.recipeName || !formData.recipe || !formData.branchName || !formData.caption) {
            alert("Please fill in all required fields.");
            return;
        }
        try {
            let imageUrl = "";
            if (formData.image) {
                imageUrl = await convertToBase64(formData.image);
            }
            // Save the form data to Firestore
            const recipesCollection = collection(db, "recipes");
            const recipeData = {
                recipeName: formData.recipeName,
                recipe: formData.recipe,
                branchName: formData.branchName,
                caption: formData.caption,
                imageUrl: imageUrl || null, 
                userId: formData.userId,
                createdAt: new Date(),
                likes: 0,
            };
            const docRef = await addDoc(recipesCollection, recipeData);
            navigate(`/recipe/${docRef.id}`);
        } catch (error) {
            console.error("Error submitting the recipe: ", error);
            alert("An error occurred while submitting the recipe. Please try again.");
        }
    };

    const handleCancel = () => {
        navigate("/"); 
    };

    return (
        <div className="post-container">
            <div>
                <form onSubmit={handleSubmit}>
                    <label>
                        Recipe Name:
                        <input
                            type="text"
                            name="recipeName"
                            value={formData.recipeName}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Recipe:
                        <textarea
                            name="recipe"
                            value={formData.recipe}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Branch Name:
                        <input
                            type="text"
                            name="branchName"
                            value={formData.branchName}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Caption:
                        <input
                            type="text"
                            name="caption"
                            value={formData.caption}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Upload Image:
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </label>
                    <div className="form-buttons">
                        <button type="button" className="cancel-button" onClick={handleCancel}>
                            Cancel
                        </button>
                        <button type="submit" className="submit-button">
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Post;
