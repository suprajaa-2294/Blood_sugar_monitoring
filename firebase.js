//firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBGU0se_MLtlGA9q2zEi1hnKhlSt_XCAt4",
  authDomain: "sugarfit-ba5df.firebaseapp.com",  // Based on typical Firebase domain format
  projectId: "sugarfit-ba5df",
  storageBucket: "sugarfit-ba5df.appspot.com",
  messagingSenderId: "656034457381",
  appId: "1:656034457381:android:5b79f8ef323722a5a45ccc",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
