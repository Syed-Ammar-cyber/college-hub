import React, { useState, useEffect } from 'react';
import { doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

function CommentsModal({ post, user, onClose, onCommentAdded }) {
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Test Firestore connectivity when component mounts
  useEffect(() => {
    const testFirestore = async () => {
      try {
        const postRef = doc(db, 'posts', post.id);
        const postDoc = await getDoc(postRef);
        console.log('Firestore test - Post exists:', postDoc.exists());
        console.log('Firestore test - Post data:', postDoc.data());
      } catch (error) {
        console.error('Firestore test failed:', error);
        setError(`Firestore connection error: ${error.message}`);
      }
    };
    
    testFirestore();
  }, [post.id]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    console.log('Submitting comment:', newComment);
    setError('');
    
    if (!newComment.trim()) {
      console.log('Comment is empty, returning');
      setError('Comment cannot be empty');
      return;
    }

    setLoading(true);
    try {
      const postRef = doc(db, 'posts', post.id);
      const comment = {
        id: Date.now().toString(),
        content: newComment.trim(),
        author: user.email,
        authorId: user.uid,
        timestamp: new Date()
      };

      console.log('Adding comment to post:', post.id, comment);

      await updateDoc(postRef, {
        comments: arrayUnion(comment)
      });

      // Update user's comment count
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        commentCount: (await getDoc(userRef)).data()?.commentCount + 1 || 1
      });

      console.log('Comment added successfully');
      setNewComment('');
      onCommentAdded();
    } catch (error) {
      console.error('Error adding comment:', error);
      setError(`Failed to add comment: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    
    const now = new Date();
    const commentTime = timestamp instanceof Date ? timestamp : timestamp.toDate();
    const diffInMinutes = Math.floor((now - commentTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content comments-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Comments</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className="post-summary">
          <h3>{post.title}</h3>
          <p>{post.content}</p>
        </div>

        <div className="comments-section">
          <h3>Comments ({post.comments ? post.comments.length : 0})</h3>
          
          <div className="comments-list">
            {post.comments && post.comments.length > 0 ? (
              post.comments.map((comment) => (
                <div key={comment.id} className="comment-item">
                  <div className="comment-header">
                    <span className="comment-author">{comment.author}</span>
                    <span className="comment-time">{formatTime(comment.timestamp)}</span>
                  </div>
                  <p className="comment-content">{comment.content}</p>
                </div>
              ))
            ) : (
              <p className="no-comments">No comments yet. Be the first to comment!</p>
            )}
          </div>

          <form onSubmit={handleSubmitComment} className="comment-form">
            {error && (
              <div style={{ color: '#ff4500', marginBottom: '15px', textAlign: 'center' }}>
                {error}
              </div>
            )}
            <div className="form-group">
              <label htmlFor="new-comment">Add a comment</label>
              <textarea
                id="new-comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="What are your thoughts?"
                required
                rows={3}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #343536',
                  borderRadius: '4px',
                  backgroundColor: '#272729',
                  color: '#d7dadc',
                  fontSize: '16px',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading || !newComment.trim()}
              style={{ width: 'auto', padding: '10px 20px' }}
            >
              {loading ? 'Posting...' : 'Post Comment'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CommentsModal;
