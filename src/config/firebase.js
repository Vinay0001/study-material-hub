import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase configuration
// You need to replace these with your actual Firebase project credentials

// Get these from: Firebase Console > Project Settings > General > Your apps > Web app
const firebaseConfig = {
    apiKey: "AIzaSyC9Irn3Ltc7SB7syiK5yNgJniqvs3keyoo",
    authDomain: "studyhub-fdebe.firebaseapp.com",
    projectId: "studyhub-fdebe",
    storageBucket: "studyhub-fdebe.firebasestorage.app",
    messagingSenderId: "107211113324",
    appId: "1:107211113324:web:de5e6e34aa288d0e806949"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const storage = getStorage(app);
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;
