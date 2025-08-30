import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersRef = collection(db, 'users');
      const q = query(usersRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const usersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString();
  };

  const getActiveStatus = (lastSeen) => {
    if (!lastSeen) return 'Never';
    const lastSeenDate = lastSeen.toDate ? lastSeen.toDate() : new Date(lastSeen);
    const now = new Date();
    const diffInHours = Math.floor((now - lastSeenDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Active now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return 'Inactive';
  };

  if (loading) {
    return (
      <div className="admin-panel">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div className="spinner"></div>
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-panel">
        <div style={{ textAlign: 'center', padding: '40px', color: '#ff4500' }}>
          <p>{error}</p>
          <button onClick={fetchUsers} className="btn btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>👥 User Management</h1>
        <p>Total Registered Users: {users.length}</p>
        <button onClick={fetchUsers} className="refresh-btn">
          🔄 Refresh
        </button>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Email</th>
              <th>User ID</th>
              <th>Created</th>
              <th>Last Seen</th>
              <th>Status</th>
              <th>Posts</th>
              <th>Comments</th>
              <th>Activity</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td className="user-email">{user.email}</td>
                <td className="user-id">{user.id.substring(0, 8)}...</td>
                <td>{formatTime(user.createdAt)}</td>
                <td>{formatTime(user.lastSeen)}</td>
                <td>
                  <span className={`status ${getActiveStatus(user.lastSeen).toLowerCase().replace(' ', '-')}`}>
                    {getActiveStatus(user.lastSeen)}
                  </span>
                </td>
                <td>{user.postCount || 0}</td>
                <td>{user.commentCount || 0}</td>
                <td>
                  <div className="activity-bar">
                    <div 
                      className="activity-fill" 
                      style={{ 
                        width: `${Math.min(((user.postCount || 0) + (user.commentCount || 0)) * 10, 100)}%` 
                      }}
                    ></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#818384' }}>
          <h3>No users found</h3>
          <p>No users have registered yet.</p>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
