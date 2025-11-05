// ----------------- Page Loaded After User Sign-in -------------------------//

// ----------------- Firebase Setup & Initialization ------------------------//

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signOut } 
  from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

// Import the functions you need from the SDKs you need
  import { getDatabase, ref, set, update, child, get, remove } 
    from "https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyDZ3cLyghX5OnT6h4jDkUgXxwf-5GfWXZY",
    authDomain: "edd-2025.firebaseapp.com",
    databaseURL: "https://edd-2025-default-rtdb.firebaseio.com",
    projectId: "edd-2025",
    storageBucket: "edd-2025.firebasestorage.app",
    messagingSenderId: "831903374189",
    appId: "1:831903374189:web:b7e220228a0c2c51f05864"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth();

// Return an instance of your app's database
const db = getDatabase(app)



// ---------------------// Get reference values -----------------------------
let selectLevel = document.getElementById('selectLevelLink');     // User name for navbar
let signOutLink = document.getElementById('signOut');   // Sign out link
let shop = document.getElementById('shopLink');       // Welcome header
let currentUser = null;                                 // Initialize current user to null


// ----------------------- Get User's Name'Name ------------------------------
function getUserName(){
  // Grab value for the 'keep logged in' switch
  let keepLoggedIn = localStorage.getItem('keepLoggedIn');

  // Grab the user information from the signIn.JSF
  if(keepLoggedIn == 'yes'){
    currentUser = JSON.parse(localStorage.getItem('user'));
  } else {
    currentUser = JSON.parse(sessionStorage.getItem('user'));
  }
}

// Sign-out function that will remove user info from local/session storage and
// sign-out from FRD
function signOutUser(){
  sessionStorage.removeItem('user');
  localStorage.removeItem('user');
  localStorage.removeItem('keepLoggedIn');

  signOut(auth).then(() => {
    //Sign out successful
  }).catch((error) => {
    // Error occured
  });

  window.location = 'home.html';
}

// --------------------------- Home Page Loading -----------------------------
window.onload = function(){
  // ------------------------- Set Welcome Message -------------------------
  getUserName();    // Get current user's first name
  if(currentUser == null){
    selectLevel.innerText = "Create Account";
    selectLevel.href = 'register.html';

    shop.innerText = "";
    shop.href = '#';
    shop.classList.replace('toggled', 'untoggled');

    signOutLink.innerText = 'Sign In';
    signOutLink.classList.replace('nav-link', 'btn');
    signOutLink.classList.add('btn-success');
    signOutLink.href = 'signIn.html';
  } else {
    selectLevel.innerText = 'Select Level';
    selectLevel.href = 'selectLevel.html';

    shop.innerText = "Shop";
    shop.href = 'shop.html';
    shop.classList.replace('untoggled', 'toggled');

    signOutLink.innerText = 'Sign Out';
    signOutLink.classList.replace('btn', 'nav-link');
    document.getElementById('signOut').onclick = function(){
      signOutUser();
    }
  }
}