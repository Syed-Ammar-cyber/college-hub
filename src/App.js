import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Login from './components/Login';
import Signup from './components/Signup';
import Community from './components/Community';
import AdminPanel from './components/AdminPanel';
import FirebaseTest from './components/FirebaseTest';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/login" 
            element={user ? <Navigate to="/community" /> : <Login />} 
          />
          <Route 
            path="/signup" 
            element={user ? <Navigate to="/community" /> : <Signup />} 
          />
          <Route 
            path="/community" 
            element={user ? <Community user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/admin" 
            element={user ? <AdminPanel /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/test" 
            element={<FirebaseTest />} 
          />
          <Route 
            path="/" 
            element={<Navigate to={user ? "/community" : "/login"} />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
