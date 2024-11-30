import { initializeApp } from "firebase/app";
import { getFirestore,setLogLevel } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

// Your Firebase configuration, which you can find in the Firebase console
const firebaseConfig = {
  apiKey: "AIzaSyDJQ848sFAJsjcmPW6LTmKhQ42VqgWKLAw",
  authDomain:"movie-app-74ddf.firebaseapp.com",
  projectId: "movie-app-74ddf",
  storageBucket: "movie-app-74ddf.firebasestorage.app",
  messagingSenderId: "356975462597",
  appId: "1:356975462597:web:92578f14c56ff8759688ac",
  measurementId: "G-SZQK11BK98"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics=getAnalytics(app);
// Export Firebase services
const db = getFirestore(app); // Firestore database
const auth = getAuth(app); // Firebase Authentication
const storage = getStorage(app); // Firebase Storage

export { db, auth, storage };
