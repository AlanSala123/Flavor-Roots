import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import "../styles/Post.css";

function EditProfile({ userId }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        profilePicture: "",
    });
    const [newProfilePicture, setNewProfilePicture] = useState(null);

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    // Fetch user data when the component loads
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userDoc = await getDoc(doc(db, "users", userId));
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    setFormData({
                        firstName: data.firstName || "",
                        lastName: data.lastName || "",
                        username: data.username || "",
                        profilePicture: data.profilePicture || "",
                    });
                } else {
                    alert("User data not found.");
                }
            } catch (error) {
                console.error("Error fetching user data: ", error);
            }
        };

        fetchUserData();
    }, [userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setNewProfilePicture(file);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let profilePictureUrl = newProfilePicture;
            if (profilePictureUrl) {
                profilePictureUrl = await convertToBase64(profilePictureUrl);
            }
            // Update user data in Firestore
            const userDocRef = doc(db, "users", userId);
            await updateDoc(userDocRef, {
                firstName: formData.firstName,
                lastName: formData.lastName,
                username: formData.username,
                profilePicture: profilePictureUrl || formData.profilePicture,
            });
            navigate("/profile");
        } catch (error) {
            console.error("Error updating profile: ", error);
            alert("An error occurred while updating the profile. Please try again.");
        }
    };

    const handleCancel = () => {
        navigate("/profile");
    };

    return (
        <div className="post-container">
            <div>
                <form onSubmit={handleSubmit}>
                    <label>
                        First Name:
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Last Name:
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Username:
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Profile Picture:
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </label>
                    {formData.profilePicture && (
                        <div>
                            <p>Current Profile Picture:</p>
                            <img
                                src={formData.profilePicture}
                                alt="Profile"
                                style={{ width: "100px", height: "100px", borderRadius: "50%" }}
                            />
                        </div>
                    )}
                    <div className="form-buttons">
                        <button type="button" className="cancel-button" onClick={handleCancel}>
                            Cancel
                        </button>
                        <button type="submit" className="submit-button">
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditProfile;
