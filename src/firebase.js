import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

// Replace this config with your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBF4MYdGoqziME_5ubch8Bpv9yufs6n6sA",
    authDomain: "new-app789654123.firebaseapp.com",
    projectId: "new-app789654123",
    storageBucket: "new-app789654123.appspot.com",
    messagingSenderId: "603752757026",
    appId: "1:603752757026:web:685bc1dacf494c3bb9977b"
  };

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();
