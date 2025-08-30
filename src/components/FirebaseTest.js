import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

function FirebaseTest() {
  const [testResult, setTestResult] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const testFirebaseConnection = async () => {
    setLoading(true);
    setTestResult('Testing Firebase connection...\n');
    
    try {
      // Test 1: Try to add a test document
      setTestResult(prev => prev + '🔍 Test 1: Adding test document...\n');
      
      const testDoc = await addDoc(collection(db, 'test'), {
        message: 'Firebase connection test',
        timestamp: serverTimestamp(),
        test: true
      });
      
      setTestResult(prev => prev + `✅ Test document created: ${testDoc.id}\n`);
      
      // Test 2: Try to create a user document
      setTestResult(prev => prev + '🔍 Test 2: Creating test user document...\n');
      
      const testUserId = 'test-user-' + Date.now();
      const userData = {
        email: 'test@example.com',
        uid: testUserId,
        createdAt: serverTimestamp(),
        lastSeen: serverTimestamp(),
        postCount: 0,
        commentCount: 0,
        upvotesReceived: 0,
        downvotesReceived: 0
      };
      
      await setDoc(doc(db, 'users', testUserId), userData);
      setTestResult(prev => prev + `✅ Test user created: ${testUserId}\n`);
      
      // Test 3: Try to read from users collection
      setTestResult(prev => prev + '🔍 Test 3: Reading users collection...\n');
      
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersList = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setUsers(usersList);
      setTestResult(prev => prev + `✅ Found ${usersList.length} users in collection\n`);
      
      setTestResult(prev => prev + '\n🎉 All tests passed! Firebase is working correctly.\n');
      
    } catch (error) {
      console.error('Firebase test error:', error);
      setTestResult(prev => prev + `❌ Test failed: ${error.message}\n`);
      setTestResult(prev => prev + `❌ Error code: ${error.code}\n`);
    }
    
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>🔥 Firebase Connection Test</h1>
      
      <button 
        onClick={testFirebaseConnection} 
        disabled={loading}
        style={{
          padding: '10px 20px',
          backgroundColor: '#ff4500',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        {loading ? 'Testing...' : 'Run Firebase Test'}
      </button>
      
      <div style={{
        backgroundColor: '#1a1a1b',
        border: '1px solid #343536',
        borderRadius: '4px',
        padding: '20px',
        marginBottom: '20px',
        whiteSpace: 'pre-wrap',
        fontFamily: 'monospace',
        fontSize: '14px'
      }}>
        {testResult || 'Click "Run Firebase Test" to start...'}
      </div>
      
      {users.length > 0 && (
        <div>
          <h2>📊 Users in Database ({users.length})</h2>
          <div style={{
            backgroundColor: '#1a1a1b',
            border: '1px solid #343536',
            borderRadius: '4px',
            padding: '20px'
          }}>
            {users.map((user, index) => (
              <div key={user.id} style={{ marginBottom: '10px', padding: '10px', backgroundColor: '#272729', borderRadius: '4px' }}>
                <strong>User {index + 1}:</strong> {user.email || 'No email'} (ID: {user.id})
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default FirebaseTest;
