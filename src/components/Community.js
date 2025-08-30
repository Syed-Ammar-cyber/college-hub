import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  getDocs, 
  orderBy, 
  query, 
  serverTimestamp,
  doc,
  updateDoc
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import CreatePostModal from './CreatePostModal';
import CommentsModal from './CommentsModal';

function Community({ user }) {
  const [posts, setPosts] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      const postsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(postsData);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };



  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleCreatePost = async (title, content) => {
    try {
      await addDoc(collection(db, 'posts'), {
        title,
        content,
        author: user.email,
        authorId: user.uid,
        timestamp: serverTimestamp(),
        upvotes: 0,
        downvotes: 0,
        upvotedBy: [],
        downvotedBy: [],
        comments: []
      });
      
      setShowCreateModal(false);
      fetchPosts(); // Refresh posts
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleUpvote = async (postId, currentUpvotes, upvotedBy, downvotedBy) => {
    try {
      const postRef = doc(db, 'posts', postId);
      const userEmail = user.email;
      
      let newUpvotes = currentUpvotes;
      let newUpvotedBy = [...upvotedBy];
      let newDownvotedBy = [...downvotedBy];

      // If user already upvoted, remove upvote
      if (upvotedBy.includes(userEmail)) {
        newUpvotes -= 1;
        newUpvotedBy = upvotedBy.filter(email => email !== userEmail);
      } 
      // If user downvoted, remove downvote and add upvote
      else if (downvotedBy.includes(userEmail)) {
        newUpvotes += 1;
        newDownvotedBy = downvotedBy.filter(email => email !== userEmail);
        newUpvotedBy.push(userEmail);
      } 
      // Add upvote
      else {
        newUpvotes += 1;
        newUpvotedBy.push(userEmail);
      }

      await updateDoc(postRef, {
        upvotes: newUpvotes,
        downvotes: newDownvotedBy.length,
        upvotedBy: newUpvotedBy,
        downvotedBy: newDownvotedBy
      });

      fetchPosts(); // Refresh posts
    } catch (error) {
      console.error('Error upvoting:', error);
    }
  };

  const handleDownvote = async (postId, currentDownvotes, upvotedBy, downvotedBy) => {
    try {
      const postRef = doc(db, 'posts', postId);
      const userEmail = user.email;
      
      let newDownvotes = currentDownvotes;
      let newUpvotedBy = [...upvotedBy];
      let newDownvotedBy = [...downvotedBy];

      // If user already downvoted, remove downvote
      if (downvotedBy.includes(userEmail)) {
        newDownvotes -= 1;
        newDownvotedBy = downvotedBy.filter(email => email !== userEmail);
      } 
      // If user upvoted, remove upvote and add downvote
      else if (upvotedBy.includes(userEmail)) {
        newDownvotes += 1;
        newUpvotedBy = upvotedBy.filter(email => email !== userEmail);
        newDownvotedBy.push(userEmail);
      } 
      // Add downvote
      else {
        newDownvotes += 1;
        newDownvotedBy.push(userEmail);
      }

      await updateDoc(postRef, {
        upvotes: newUpvotedBy.length,
        downvotes: newDownvotes,
        upvotedBy: newUpvotedBy,
        downvotedBy: newDownvotedBy
      });

      fetchPosts(); // Refresh posts
    } catch (error) {
      console.error('Error downvoting:', error);
    }
  };

  const handleShowComments = (post) => {
    console.log('Opening comments for post:', post);
    setSelectedPost(post);
    setShowCommentsModal(true);
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    
    const now = new Date();
    const postTime = timestamp.toDate();
    const diffInMinutes = Math.floor((now - postTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const isUpvoted = (post) => {
    return post.upvotedBy && post.upvotedBy.includes(user.email);
  };

  const isDownvoted = (post) => {
    return post.downvotedBy && post.downvotedBy.includes(user.email);
  };

  return (
    <div className="community-container">
      <div className="community-header">
        <div className="user-info">
          <div className="user-avatar">
            {user.email.charAt(0).toUpperCase()}
          </div>
          <span className="user-email">{user.email}</span>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
        
        <h1>PSIT </h1>
        <p>Share your thoughts, ask questions, and engage with others!</p>
        <button 
          className="create-post-btn" 
          onClick={() => setShowCreateModal(true)}
        >
          Create Post
        </button>
      </div>



      <div className="posts-container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div className="spinner"></div>
            <p>Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#818384' }}>
            <h3>No posts yet</h3>
            <p>Be the first to create a post!</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <span className="post-author">{post.author}</span>
                <span className="post-time">{formatTime(post.timestamp)}</span>
              </div>
              <h3 className="post-title">{post.title}</h3>
              <p className="post-content">{post.content}</p>
              <div className="post-actions">
                <div 
                  className={`post-action ${isUpvoted(post) ? 'active' : ''}`}
                  onClick={() => handleUpvote(
                    post.id, 
                    post.upvotes || 0, 
                    post.upvotedBy || [], 
                    post.downvotedBy || []
                  )}
                >
                  <span>👍 {post.upvotes || 0}</span>
                </div>
                <div 
                  className={`post-action ${isDownvoted(post) ? 'active' : ''}`}
                  onClick={() => handleDownvote(
                    post.id, 
                    post.downvotes || 0, 
                    post.upvotedBy || [], 
                    post.downvotedBy || []
                  )}
                >
                  <span>👎 {post.downvotes || 0}</span>
                </div>
                <div 
                  className="post-action"
                  onClick={() => handleShowComments(post)}
                >
                  <span>💬 {post.comments ? post.comments.length : 0}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showCreateModal && (
        <CreatePostModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreatePost}
        />
      )}

      {showCommentsModal && selectedPost && (
        <CommentsModal
          post={selectedPost}
          user={user}
          onClose={() => {
            setShowCommentsModal(false);
            setSelectedPost(null);
          }}
          onCommentAdded={() => {
            fetchPosts();
          }}
        />
      )}
    </div>
  );
}

export default Community;
