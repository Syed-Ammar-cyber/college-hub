# 🔥 Firebase Users Collection - Admin Guide

## 📊 **Current Setup**

Your website automatically creates a `users` collection in Firebase Firestore when users sign up. Each user document contains:

### **User Document Structure:**
```javascript
{
  email: "user@example.com",           // User's email address
  uid: "firebase-auth-uid",            // Firebase Auth UID
  createdAt: Timestamp,                // Account creation date
  lastSeen: Timestamp,                 // Last login timestamp
  postCount: 0,                        // Number of posts created
  commentCount: 0,                     // Number of comments made
  upvotesReceived: 0,                  // Total upvotes received
  downvotesReceived: 0                 // Total downvotes received
}
```

## 🛠️ **How to View Users**

### **Method 1: Firebase Console (Recommended)**
1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Select your project
3. Click "Firestore Database" in the left sidebar
4. Click "Data" tab
5. Look for the `users` collection
6. Click on any document to view user details

### **Method 2: Admin Panel in Your App**
1. Start your React app: `npm start`
2. Log in to your account
3. Navigate to: `http://localhost:3000/admin`
4. View all users in a beautiful table format

### **Method 3: Node.js Script**
1. Update the Firebase config in `view-users.js`
2. Install dependencies: `npm install firebase`
3. Run the script: `node view-users.js`

## 📈 **Admin Panel Features**

The admin panel (`/admin` route) provides:

- **📋 User List**: All registered users in a table
- **📊 Activity Stats**: Posts, comments, and activity levels
- **⏰ Last Seen**: User activity status (Active now, 2h ago, etc.)
- **🔄 Real-time Refresh**: Update data with one click
- **📱 Responsive Design**: Works on all devices

## 🔐 **Security Rules**

Your Firestore security rules allow:
- ✅ Reading user profiles for everyone
- ✅ Users can create/update their own profile
- ✅ Users can delete their own profile

## 📝 **User Activity Tracking**

The system automatically tracks:
- **Account Creation**: When user first signs up
- **Login Activity**: Updates `lastSeen` on every login
- **Post Creation**: Increments `postCount` when user creates posts
- **Comment Activity**: Increments `commentCount` when user comments

## 🚀 **Getting Started**

1. **View in Firebase Console:**
   - Open Firebase Console
   - Navigate to Firestore Database
   - Look for `users` collection

2. **Use Admin Panel:**
   - Start your app: `npm start`
   - Go to: `http://localhost:3000/admin`
   - View all users with detailed stats

3. **Run Script:**
   - Update Firebase config in `view-users.js`
   - Run: `node view-users.js`

## 📊 **Example User Data**

```javascript
// Example user document
{
  id: "abc123def456",
  email: "john@example.com",
  uid: "abc123def456",
  createdAt: Timestamp(2024-01-15T10:30:00Z),
  lastSeen: Timestamp(2024-01-20T14:45:00Z),
  postCount: 5,
  commentCount: 12,
  upvotesReceived: 25,
  downvotesReceived: 3
}
```

## 🔧 **Customization**

You can modify the user tracking by editing:
- `src/components/Signup.js` - Initial user creation
- `src/components/Login.js` - Last seen updates
- `src/components/Community.js` - Post/comment counting
- `src/components/AdminPanel.js` - Admin interface

## 📞 **Support**

If you need help:
1. Check Firebase Console for data
2. Verify Firestore security rules
3. Check browser console for errors
4. Ensure Firebase config is correct

---

**🎉 Your users collection is already working! Every new signup creates a user document automatically.**
