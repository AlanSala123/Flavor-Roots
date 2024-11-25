import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig";
import "../styles/LikedPosts.css";
import Loading from "./Loading";

function LikedPosts({ userId }) {
  const [likedPosts, setLikedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLikedPosts = async () => {
      try {
        const userRef = doc(db, "users", userId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const likedPostIds = userDoc.data().likedPosts || [];
          if (likedPostIds.length === 0) {
            setLikedPosts([]);
            setLoading(false);
            return;
          }
          
          const postsRef = collection(db, "recipes");
          const likedPostsQuery = query(postsRef, where("__name__", "in", likedPostIds.slice(0, 10))); 
          const querySnapshot = await getDocs(likedPostsQuery);

          const fetchedPosts = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setLikedPosts(fetchedPosts);
        } else {
          console.log("User not found!");
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching liked posts:", error);
        setLoading(false);
      }
    };

    fetchLikedPosts();
  }, [userId]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="previous-posts-container">
      <header className="previous-posts-header">
        <h2>Liked Posts</h2>
      </header>

      {likedPosts.length === 0 ? (
        <p>You haven't liked any posts yet.</p>
      ) : (
        <div className="posts-grid">
          {likedPosts.map((post) => (
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
      <button onClick={() => navigate("/profile")} className="back-button">
        Back
      </button>
    </div>
  );
}

export default LikedPosts;
