


import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
    apiKey: "AIzaSyDFoDD_oHhVhs3KWGNLmbDP17u_1XaD22U",
    authDomain: "mood-music-8dbe6.firebaseapp.com",
    projectId: "mood-music-8dbe6",
    storageBucket: "mood-music-8dbe6.firebasestorage.app",
    messagingSenderId: "121124481365",
    appId: "1:121124481365:web:f2e297af81c662589a67dc"
  
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Export both named
export { app, auth }
