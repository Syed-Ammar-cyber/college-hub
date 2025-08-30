import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      console.log('🚀 Starting signup process...');
      
      // Create the user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      console.log('✅ User account created:', user.uid);
      console.log('📧 User email:', user.email);

      // Create a user profile in Firestore
      const userDocRef = doc(db, 'users', user.uid);
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
      
      console.log('✅ User profile created successfully in Firestore');
      console.log('🎯 Document path: users/', user.uid);
      
      navigate('/community');
    } catch (error) {
      console.error('❌ Signup error:', error);
      console.error('❌ Error code:', error.code);
      console.error('❌ Error message:', error.message);
      
      if (error.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists.');
      } else if (error.code === 'auth/weak-password') {
        setError('Password is too weak.');
      } else if (error.code === 'permission-denied') {
        setError('Permission denied. Please check your Firebase rules.');
      } else if (error.code === 'unavailable') {
        setError('Firebase service unavailable. Please try again.');
      } else {
        setError(`Failed to create account: ${error.message}`);
      }
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="logo-container">
          <h1 className="logo">
            <span className="logo-text">college</span>
            <span className="logo-highlight">Hub</span>
          </h1>
        </div>
        <h2>Sign Up</h2>
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
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>
        <div className="auth-links">
          <p>Already have an account? <Link to="/login">Log in</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
