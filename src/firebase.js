import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import "firebase/compat/database";
import "firebase/compat/storage";

let config = {
  apiKey: "AIzaSyBMTrMyMQ3nf5QHMEO3YxEwU-c7bZ_ZKwA",
  authDomain: "watchlist-e6c0d.firebaseapp.com",
  databaseURL: "https://watchlist-e6c0d-default-rtdb.firebaseio.com/",
  projectId: "watchlist-e6c0d",
  storageBucket: "watchlist-e6c0d.appspot.com",
  messagingSenderId: "91967076817",
  appId: "1:91967076817:web:167672d73ecbf58eeac8f0",
};


 firebase.initializeApp(config);

const auth = firebase.auth();
const database = firebase.database();

export{ firebase, auth, database}