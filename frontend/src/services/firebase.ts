// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyDTwkl5wxkgEpGw6CZsENAPU6moxtUjxq4",
    authDomain: "kickdao-5cd6d.firebaseapp.com",
    projectId: "kickdao-5cd6d",
    storageBucket: "kickdao-5cd6d.firebasestorage.app",
    messagingSenderId: "1008857733691",
    appId: "1:1008857733691:web:b93ab7d08ef3e7d4965a1e",
    measurementId: "G-WFHPRTKZCT"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { db, auth, analytics };
