// Migration script to update existing posts
// Run this in your browser console after opening your app

import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from './src/firebase';

async function migratePosts() {
  try {
    const postsRef = collection(db, 'posts');
    const querySnapshot = await getDocs(postsRef);
    
    const updatePromises = querySnapshot.docs.map(async (docSnapshot) => {
      const post = docSnapshot.data();
      
      // Check if post needs migration
      if (!post.hasOwnProperty('upvotedBy') || !post.hasOwnProperty('downvotedBy') || !post.hasOwnProperty('comments')) {
        const postRef = doc(db, 'posts', docSnapshot.id);
        await updateDoc(postRef, {
          upvotedBy: post.upvotedBy || [],
          downvotedBy: post.downvotedBy || [],
          comments: post.comments || [],
          upvotes: post.upvotes || 0,
          downvotes: post.downvotes || 0
        });
        console.log(`Migrated post: ${docSnapshot.id}`);
      }
    });
    
    await Promise.all(updatePromises);
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Uncomment the line below to run migration
// migratePosts();
