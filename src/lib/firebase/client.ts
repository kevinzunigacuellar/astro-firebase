import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyD8bSsEcYrV7Whgf8L6UD_P4M9SR_jb81k",
  authDomain: "astro-auth-6cc43.firebaseapp.com",
  projectId: "astro-auth-6cc43",
  storageBucket: "astro-auth-6cc43.appspot.com",
  messagingSenderId: "469295571959",
  appId: "1:469295571959:web:20b9159287f8113f2744f2",
};

export const app = initializeApp(firebaseConfig);
