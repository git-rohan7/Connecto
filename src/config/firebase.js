import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyBoWpxAl3jBKCBEvl2_hPNGYS-ANwNzHUU",
  authDomain: "chat-app-d012f.firebaseapp.com",
  projectId: "chat-app-d012f",
  storageBucket: "chat-app-d012f.firebasestorage.app",
  messagingSenderId: "455104652684",
  appId: "1:455104652684:web:7ed877386f8f47442ce2a9",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

const signup = async (username, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      username: username.toLowerCase(),
      email,
      name: "",
      avatar: "",
      bio: "Hey, I am using chat-app",
      lastSeen: Date.now(),
    });
    await setDoc(doc(db, "chats", user.uid), {
      chatData: [],
    });
  } catch (error) {
    console.error(error);
    toast.error(error.code.split("/")[1].split("-").join(" "));
  }
};

const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error(error);
    toast.error(error.code.split("/")[1].split("-").join(" "));
  }
};

const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error(error);
    toast.error(error.code.split("/")[1].split("-").join(" "));
  }
};

const resetPass = async (email) => {
  if (!email) {
    toast.error("Enter your mail");
    return null;
  }
  try {
    const userRef = collection(db, "users");
    const q = query(userRef, where("email", "==", email));
    const querySnapShot = await getDocs(q);
    if (!querySnapShot.empty) {
      await sendPasswordResetEmail(auth, email);
      toast.success("Reset Emal sent...");
    } else {
      toast.error("Email does not exist.");
    }
  } catch (error) {
    console.error(error);
    toast.error(error.message);
  }
};

export { signup, login, logout, db, auth, resetPass };
