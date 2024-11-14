import React from "react";
import {useState} from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Post.css";

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

     const handleSubmit = (e) => {
        e.preventDefault();
        // Will need to add more here later
        console.log(formData);
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
