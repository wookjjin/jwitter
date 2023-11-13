import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBiGL-rYjfYtXuYGqomQ06llHF2WZD4vJw",
  authDomain: "jwitter-2b3cf.firebaseapp.com",
  projectId: "jwitter-2b3cf",
  storageBucket: "jwitter-2b3cf.appspot.com",
  messagingSenderId: "268600120244",
  appId: "1:268600120244:web:47a0fd208bb4c39b2d58e1"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const storage = getStorage(app)

export const db = getFirestore()