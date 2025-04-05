// firebase.ts
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // Importa getAuth
import { getFirestore } from "firebase/firestore"; // Importa getFirestore

const firebaseConfig = {
    apiKey: "AIzaSyAjiuV5YgJmAxxkRZRV5VxUv_AKCQzXOS4",
    authDomain: "movix-efd31.firebaseapp.com",
    projectId: "movix-efd31",
    storageBucket: "movix-efd31.firebasestorage.app",
    messagingSenderId: "695018438370",
    appId: "1:695018438370:web:8b971bb0b9e4535f35e8bb",
    measurementId: "G-KGJ3D3225H"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app); // Usa getAuth(app)
const db = getFirestore(app); // Usa getFirestore(app)

export { app, analytics , auth, db};