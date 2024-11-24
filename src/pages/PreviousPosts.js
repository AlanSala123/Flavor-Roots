import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig"; 
import "../styles/PreviousPosts.css"; 

function PreviousPosts({ userId }) {
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const postsRef = collection(db, "recipes");
        const userPostsQuery = query(postsRef, where("userId", "==", userId));
        const querySnapshot = await getDocs(userPostsQuery);

        const fetchedPosts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setUserPosts(fetchedPosts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user posts:", error);
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [userId]);

  if (loading) {
    return <div>Loading your posts...</div>;
  }

  return (
    <div className="previous-posts-container">
      <header className="previous-posts-header">
        <h2>Your Previous Posts</h2>
      </header>

      {userPosts.length === 0 ? (
        <p>No previous posts found</p>
      ) : (
        <div className="posts-grid">
          {userPosts.map((post) => (
            <Link
              to={`/recipe/${post.id}`}
              key={post.id}
              className="post-card-link"
            >
              <div className="post-card">
                <div className="post-card-image">
                  <img
                    src={post.imageUrl}
                    alt={post.caption}
                    className="card-image"
                  />
                </div>
                <div className="post-card-content">
                  <h3>{post.recipeName}</h3>
                  <p>{post.caption}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      <button onClick={() => navigate("/profile")} className="back-button"> Back </button>
    </div>
  );
}

export default PreviousPosts;
