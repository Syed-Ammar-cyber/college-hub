import React, { useState } from 'react';

function CreatePostModal({ onClose, onSubmit }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit(title.trim(), content.trim());
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create a Post</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="post-title">Title</label>
            <input
              type="text"
              id="post-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title..."
              required
              maxLength={300}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="post-content">Content</label>
            <textarea
              id="post-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              required
              rows={6}
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
          
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onClose}
              style={{ width: 'auto', padding: '10px 20px' }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading || !title.trim() || !content.trim()}
              style={{ width: 'auto', padding: '10px 20px' }}
            >
              {loading ? 'Creating...' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePostModal;
