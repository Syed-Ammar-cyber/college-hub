# Reddit Clone

A Reddit-like community website built with React and Firebase. Users can sign up, log in, create posts, and view posts in a single community.

## Features

- 🔐 **Authentication**: Sign up and login with email/password using Firebase Auth
- 📝 **Create Posts**: Users can create posts with title and content
- 📋 **View Posts**: Display all posts in chronological order
- 🎨 **Modern UI**: Dark theme with Reddit-inspired design
- 📱 **Responsive**: Works on desktop and mobile devices
- 🔄 **Real-time**: Posts are stored in Firebase Firestore

## Tech Stack

- **Frontend**: React 18, React Router DOM
- **Backend**: Firebase (Authentication, Firestore)
- **Styling**: CSS3 with modern design principles

## Prerequisites

Before running this project, make sure you have:

- Node.js (version 14 or higher)
- npm or yarn
- A Firebase project with Authentication and Firestore enabled

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd reddit-clone
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable Email/Password authentication
4. Enable Firestore Database:
   - Go to Firestore Database
   - Create database in test mode (for development)
5. Get your Firebase config:
   - Go to Project Settings > General
   - Scroll down to "Your apps" section
   - Click on the web app icon (</>) to add a web app
   - Copy the configuration object

### 4. Update Firebase Configuration

Open `src/firebase.js` and replace the placeholder configuration with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### 5. Start the Development Server

```bash
npm start
```

The application will open at `http://localhost:3000`

## Project Structure

```
src/
├── components/
│   ├── Login.js          # Login component
│   ├── Signup.js         # Signup component
│   ├── Community.js      # Main community page
│   └── CreatePostModal.js # Modal for creating posts
├── App.js                # Main app component with routing
├── App.css               # Main styles
├── firebase.js           # Firebase configuration
├── index.js              # App entry point
└── index.css             # Global styles
```

## Usage

1. **Sign Up**: Create a new account with email and password
2. **Log In**: Use your credentials to access the community
3. **Create Posts**: Click "Create Post" to add new content
4. **View Posts**: Browse all posts in the community
5. **Logout**: Click the logout button to sign out

## Firebase Security Rules

For production, make sure to set up proper Firestore security rules. Here's a basic example:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /posts/{postId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Deployment

### Deploy to Firebase Hosting

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Build the project:
```bash
npm run build
```

3. Initialize Firebase hosting:
```bash
firebase init hosting
```

4. Deploy:
```bash
firebase deploy
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues or have questions, please open an issue in the repository.
