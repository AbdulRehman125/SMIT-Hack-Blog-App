  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-app.js";
  import { getAuth, createUserWithEmailAndPassword,signInWithEmailAndPassword , onAuthStateChanged ,signOut,reauthenticateWithCredential , EmailAuthProvider , updatePassword } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-auth.js";
  import { doc, setDoc ,getFirestore , getDoc , updateDoc , collection, addDoc , serverTimestamp , query, where , getDocs , deleteDoc } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-firestore.js" ;
  import { getStorage, ref, uploadBytesResumable, getDownloadURL  } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-storage.js";
  const firebaseConfig = {
    apiKey: "AIzaSyAHldIRR0217r0nj24j9a806jrsQpN_z0M",
    authDomain: "blog-app-f2fc2.firebaseapp.com",
    projectId: "blog-app-f2fc2",
    storageBucket: "blog-app-f2fc2.appspot.com",
    messagingSenderId: "925817098278",
    appId: "1:925817098278:web:a129cdf8e99307058f16e7"
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db   = getFirestore(app)
  const storage = getStorage(app)

  export{
    app,
    auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut ,
    doc, 
    setDoc,
    db,
    getDoc,
    updateDoc,
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
    storage,
    reauthenticateWithCredential,
    EmailAuthProvider,
    updatePassword,
    collection, 
    addDoc,
    serverTimestamp,
    query,
    where,
    getDocs,
    deleteDoc 
  }