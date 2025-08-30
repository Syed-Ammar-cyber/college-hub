// View Users Script for Firebase
// Run this script to see all registered users

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, orderBy } = require('firebase/firestore');

// Your Firebase config (replace with your actual config)
const firebaseConfig = {
  apiKey: "AIzaSyBPYAVPVoBaPNVeReNstR4007BPDzoJasc",
  authDomain: "collegehub-5a88e.firebaseapp.com",
  projectId: "collegehub-5a88e",
  storageBucket: "collegehub-5a88e.firebasestorage.app",
  messagingSenderId: "610685613577",
  appId: "1:610685613577:web:f9b993dcb42974c4bf2ad8",
  measurementId: "G-LD1XEK8HXE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function viewAllUsers() {
  try {
    console.log('🔍 Fetching all users from Firebase...\n');
    
    const usersRef = collection(db, 'users');
    const q = query(usersRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log('❌ No users found in the database.');
      return;
    }
    
    console.log(`✅ Found ${querySnapshot.size} registered users:\n`);
    console.log('='.repeat(80));
    
    querySnapshot.forEach((doc, index) => {
      const userData = doc.data();
      console.log(`👤 User ${index + 1}:`);
      console.log(`   ID: ${doc.id}`);
      console.log(`   Email: ${userData.email}`);
      console.log(`   Created: ${userData.createdAt ? userData.createdAt.toDate().toLocaleString() : 'Unknown'}`);
      console.log(`   Last Seen: ${userData.lastSeen ? userData.lastSeen.toDate().toLocaleString() : 'Unknown'}`);
      console.log(`   Posts: ${userData.postCount || 0}`);
      console.log(`   Comments: ${userData.commentCount || 0}`);
      console.log(`   Upvotes Received: ${userData.upvotesReceived || 0}`);
      console.log(`   Downvotes Received: ${userData.downvotesReceived || 0}`);
      console.log('-'.repeat(40));
    });
    
    console.log('\n📊 Summary:');
    console.log(`Total Users: ${querySnapshot.size}`);
    
    const activeUsers = querySnapshot.docs.filter(doc => {
      const userData = doc.data();
      if (!userData.lastSeen) return false;
      const lastSeen = userData.lastSeen.toDate();
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return lastSeen > oneWeekAgo;
    }).length;
    
    console.log(`Active Users (last 7 days): ${activeUsers}`);
    
  } catch (error) {
    console.error('❌ Error fetching users:', error);
  }
}

// Run the function
viewAllUsers();
