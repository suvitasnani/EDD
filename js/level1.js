// ----------------- Page Loaded After User Sign-in -------------------------//

// ----------------- Firebase Setup & Initialization ------------------------//

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } 
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
const dbref = ref(db);



// ---------------------// Get reference values -----------------------------
let currentUser = null;                                 // Initialize current user to null
let trackingScore = 0;
let letterArray = [];

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let ongoingTouches = new Map(); // Store active touches by their identifier

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

// --------------------------- Home Page Loading -----------------------------
window.onload = async function(){
  // ------------------------- Set Welcome Message -------------------------
  getUserName();    // Get current user's first name
  if(currentUser == null){
    window.location="home.html";
  } else {
    canvas.addEventListener("touchstart", handleStart);
    canvas.addEventListener("touchmove", handleMove);
    canvas.addEventListener("touchend", handleEnd);
    canvas.addEventListener("touchcancel", handleCancel);

    letterArray.forEach((letter)=>{
        evaluateLetter(letter);
    })
    setScore(Math.round(trackingScore));
  }
}



//taken from cited source online
function handleStart(evt) {
    evt.preventDefault(); // Prevent default browser scrolling/zooming
    const touches = evt.changedTouches;
    for (let i = 0; i < touches.length; i++) {
        ongoingTouches.set(touches[i].identifier, { x: touches[i].pageX, y: touches[i].pageY });
        // Start path on canvas, if drawing
    }
}

function handleMove(evt) {
    evt.preventDefault();
    const touches = evt.changedTouches;
    for (let i = 0; i < touches.length; i++) {
        const touch = touches[i];
        const prevTouch = ongoingTouches.get(touch.identifier);
        
        // Example of capturing the path data: store {x, y} points in an array
        // Here you would also draw on the canvas using prevTouch and touch
        
        // Update the stored position
        ongoingTouches.set(touch.identifier, { x: touch.pageX, y: touch.pageY });
    }
}
// Implement handleEnd and handleCancel to remove touches from ongoingTouches map


async function evaluateLetter(pointArray) {
    let tempScore = 0;
    const tempMax = 100 / 26;



    trackingScore += tempScore;
}

async function setScore(score){
    await update(ref(db, 'users/' + currentUser.uid + '/levels'), {
        'lvl1': score
    }).then(()=> {})
    .catch((error)=>{
    alert('There was an error. Error: ' + error);
    });
    let points = 0
    if(score > 95) {points = 10}
    else if(score > 90) {points = 9}
    else if(score > 85) {points = 8}
    else if(score > 80) {points = 7}
    else if(score > 75) {points = 6}
    else if(score > 70) {points = 5}
    else if(score > 65) {points = 4}
    else if(score > 60) {points = 3}
    else if(score > 55) {points = 2}
    else if(score > 50) {points = 1}
    await update(ref(db, 'users/' + currentUser.uid), {
        'points': points
    }).then(()=> {
        alert(`Congragulations! You scored ${score}% and received ${points} points!`);
        window.location.href='selectLevel.html';
    })
    .catch((error)=>{
        alert("There was an error. Error: " + error);
    });
}



