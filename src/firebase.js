import { initializeApp } from "firebase/app";
import { allBooksCollectionName, bookShelfCollectionName } from "./constants";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
  setDoc,
  doc,
} from "firebase/firestore";
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyAmRIixqthoZ8WadTC3zgzi3gsE0OkRmlA",
  authDomain: "react-project-6787a.firebaseapp.com",
  databaseURL: "https://react-project-6787a-default-rtdb.firebaseio.com",
  projectId: "react-project-6787a",
  storageBucket: "react-project-6787a.appspot.com",
  messagingSenderId: "102059531146",
  appId: "1:102059531146:web:b75ff4f7fff48ced718673",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

const setDefaultData = async (email) => {
  const doc_refs = await getDocs(collection(db, allBooksCollectionName), email);
  let result = [];
  doc_refs.forEach((book) => {
    result.push(book.data());
  });
  console.log("all books", result[0]);

  const defaultData = {
    all_books: result[0].all_books,
    currently_reading: [],
    read_done: [],
    want_to_read: [],
  };

  const bookref = doc(collection(db, bookShelfCollectionName), email);
  await setDoc(bookref, defaultData);
};

const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    localStorage.setItem("emailID", user.email);
    setDefaultData(user.email);
    const q = query(collection(db, "users"), where("email", "==", user.email));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
      });
    
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};
const logInWithEmailAndPassword = async (email, password) => {
  try {
    localStorage.setItem("emailID", email);
    await signInWithEmailAndPassword(auth, email, password);
   
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};
const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    localStorage.setItem("emailID", email);
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      name,
      email,
    });

    setDefaultData(email);
   
    
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};
const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    toast.success("Password reset link sent!")
  } catch (err) {
    
    alert(err.message);
  }
};
const logout = () => {
  localStorage.clear();
  signOut(auth);
  
};
export {
  auth,
  db,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
};
