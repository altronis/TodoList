import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

// THIS IS USED TO INITIALIZE THE firebase OBJECT
// PUT YOUR FIREBASE PROJECT CONFIG STUFF HERE
var firebaseConfig = {
    apiKey: "AIzaSyC28DJ0SDk_brW1XELKRODtQKnTCqJoxro",
    authDomain: "todo-hw3-999ba.firebaseapp.com",
    databaseURL: "https://todo-hw3-999ba.firebaseio.com",
    projectId: "todo-hw3-999ba",
    storageBucket: "todo-hw3-999ba.appspot.com",
    messagingSenderId: "205451756894",
    appId: "1:205451756894:web:4524d4ebbf57c042273bcf",
    measurementId: "G-HRWZ397W3N"
  };
firebase.initializeApp(firebaseConfig);

// NOW THE firebase OBJECT CAN BE CONNECTED TO THE STORE
export default firebase;