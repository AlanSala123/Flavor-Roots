import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

function NewBranch({ userId }) {
    const navigate = useNavigate();
    const [branchName, setBranchName] = useState('');

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const newBranch = {
            country: branchName,
            recipes: [],
            createdAt: new Date(),
        };

        try {
            const docRef = await addDoc(collection(db, 'branches'), newBranch);
            alert("Branch was created successfully!")
            navigate('/branches');
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    };

    return (
        <div className="post-container">
            <form onSubmit={handleSubmit}>
                <label htmlFor="branchName">Branch Name</label>
                <input
                    type="text"
                    id="branchName"
                    name="branchName"
                    placeholder="Enter branch name"
                    value={branchName}
                    onChange={(e) => setBranchName(e.target.value)}
                />
                <div className="form-buttons">
                    <button type="button" className="cancel-button" onClick={() => navigate(-1)}>
                        Cancel
                    </button>
                    <button type="submit" className="submit-button">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
}

export default NewBranch;
