import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('🚀 Starting login process...');
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      console.log('✅ User logged in:', user.uid);
      console.log('📧 User email:', user.email);

      // Check if user profile exists
      const userDocRef = doc(db, 'users', user.uid);
      console.log('🔍 Checking user profile at: users/', user.uid);
      
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        console.log('✅ User profile found, updating lastSeen...');
        // Update last seen timestamp
        await updateDoc(userDocRef, {
          lastSeen: serverTimestamp()
        });
        console.log('✅ Last seen updated successfully');
      } else {
        console.log('⚠️ User profile not found, creating new profile...');
        // Create user profile if it doesn't exist (for users who signed up before this feature)
        const userData = {
          email: user.email,
          uid: user.uid,
          createdAt: serverTimestamp(),
          lastSeen: serverTimestamp(),
          postCount: 0,
          commentCount: 0,
          upvotesReceived: 0,
          downvotesReceived: 0
        };
        
        console.log('📝 Creating user document with data:', userData);
        await setDoc(userDocRef, userData);
        console.log('✅ New user profile created successfully');
      }

      navigate('/community');
    } catch (error) {
      console.error('❌ Login error:', error);
      console.error('❌ Error code:', error.code);
      console.error('❌ Error message:', error.message);
      
      if (error.code === 'auth/user-not-found') {
        setError('No account found with this email address.');
      } else if (error.code === 'auth/wrong-password') {
        setError('Incorrect password.');
      } else if (error.code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please try again later.');
      } else if (error.code === 'permission-denied') {
        setError('Permission denied. Please check your Firebase rules.');
      } else {
        setError(`Failed to log in: ${error.message}`);
      }
    }

    setLoading(false);
  };

  return (
    <div
  className="auth-container"
  style={{
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: `
      radial-gradient(circle at top left, rgba(255, 0, 150, 0.25), transparent 50%),
      radial-gradient(circle at bottom right, rgba(0, 150, 255, 0.25), transparent 50%),
      #0d0d0d
    `,
    backgroundBlendMode: "screen",
  }}
>
      <div
    className="auth-card"
    style={{
      background: "rgba(255, 255, 255, 0.05)", // semi-transparent card
      backdropFilter: "blur(12px)", // subtle glass effect
      padding: "2rem",
      borderRadius: "1rem",
      boxShadow: "0px 10px 25px rgba(0,0,0,0.5)",
      width: "100%",
      maxWidth: "400px",
      color: "white",
    }}
  >
        <div className="logo-container">
          <h1 className="logo">
            <span className="logo-text">college</span>
            <span className="logo-highlight">Hub</span>
          </h1>
        </div>
        <h2>Log In</h2>
        {error && <div style={{ color: '#ff4500', marginBottom: '20px', textAlign: 'center' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        <div className="auth-links">
          <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
