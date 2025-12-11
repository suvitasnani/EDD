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
let lvl1Score = document.getElementById('lvl1Score');   // Sign out link
let level2 = document.getElementById('level2');     // User name for navbar
let lvl2Score = document.getElementById('lvl2Score');   // Sign out link
let level3 = document.getElementById('level3');     // User name for navbar
let lvl3Score = document.getElementById('lvl3Score');   // Sign out link
let level4 = document.getElementById('level4');     // User name for navbar
let lvl4Score = document.getElementById('lvl4Score');   // Sign out link
let level5 = document.getElementById('level5');     // User name for navbar
let lvl5Score = document.getElementById('lvl5Score');   // Sign out link
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

// --------------------------- Home Page Loading -----------------------------
window.onload = async function(){
  // ------------------------- Set Welcome Message -------------------------
  getUserName();    // Get current user's first name
  if(currentUser == null){
    window.location="home.html";
  } else {
    let levels = [];
    levels = await getLevels(currentUser.uid);
    // Set level 1 score and lock/unlock levels based on scores
    if(levels[0] > 60){
        lvl1Score.classList.replace('unpassed', 'passed');
        lvl1Score.innerText = levels[0] + "%";
        level2.href="lvl2.html";
        level2.classList.replace('locked', 'unlocked');
        level2.innerHTML = "Level 2: Fend off Bandits"
    } else {
        lvl1Score.classList.replace('passed', 'unpassed');
        lvl1Score.innerText = levels[0] + "%";
        level2.href="";
        level2.classList.replace('unlocked', 'locked');
        level2.innerHTML = "Level 2: LOCKED"
        level3.href="";
        level3.classList.replace('unlocked', 'locked');
        level3.innerHTML = "Level 3: LOCKED"
        level4.classList.replace('unlocked', 'locked');
        level4.innerHTML = "Level 4: LOCKED"
        level5.href="";
        level5.classList.replace('unlocked', 'locked');
        level5.innerHTML = "Level 5: LOCKED"
    }

    if(levels[1] > 60 && levels[0] > 60){
        lvl2Score.classList.replace('unpassed', 'passed');
        lvl2Score.innerText = levels[1] + "%";
        level3.href="lvl3.html";
        level3.classList.replace('locked', 'unlocked');
        level3.innerHTML = "Level 3: Break Into the Castle"
    } else {
        lvl2Score.classList.replace('passed', 'unpassed');
        lvl2Score.innerText = levels[1] + "%";
        level3.href="";
        level3.classList.replace('unlocked', 'locked');
        level3.innerHTML = "Level 3: LOCKED"
        level4.classList.replace('unlocked', 'locked');
        level4.innerHTML = "Level 4: LOCKED"
        level5.href="";
        level5.classList.replace('unlocked', 'locked');
        level5.innerHTML = "Level 5: LOCKED"
    }

    if(levels[2] > 60 && levels[1] > 60 && levels[0] > 60){
        lvl3Score.classList.replace('unpassed', 'passed');
        lvl3Score.innerText = levels[2] + "%";
        level4.href="lvl4.html";
        level4.classList.replace('locked', 'unlocked');
        level4.innerHTML = "Level 4: Finding the Princess"
    } else {
        lvl3Score.classList.replace('passed', 'unpassed');
        lvl3Score.innerText = levels[2] + "%";
        level4.href="";
        level4.classList.replace('unlocked', 'locked');
        level4.innerHTML = "Level 4: LOCKED"
        level5.href="";
        level5.classList.replace('unlocked', 'locked');
        level5.innerHTML = "Level 5: LOCKED"
    }

    if(levels[3] > 60 && levels[2] > 60 && levels[1] > 60 && levels[0] > 60){
        lvl4Score.classList.replace('unpassed', 'passed');
        lvl4Score.innerText = levels[3] + "%";
        level5.href="lvl5.html";
        level5.classList.replace('locked', 'unlocked');
        level5.innerHTML = "Level 5: Save Her!"
    } else {
        lvl4Score.classList.replace('passed', 'unpassed');
        lvl4Score.innerText = levels[3] + "%";
        level5.href="";
        level5.classList.replace('unlocked', 'locked');
        level5.innerHTML = "Level 5: LOCKED"
    }

    if(levels[4] > 60 && levels[3] > 60 && levels[2] > 60 && levels[1] > 60 && levels[0] > 60){
        lvl5Score.classList.replace('unpassed', 'passed');
        lvl5Score.innerText = levels[4] + "%";
    } else {
        lvl5Score.classList.replace('passed', 'unpassed');
        lvl5Score.innerText = levels[4] + "%";
    }
  }
}

// Get levels scores from database
async function getLevels(userID){
    let levels = [];
    await get(child(dbref, 'users/' + userID + '/levels')).then((snapshot)=>{
    if(snapshot.exists()){
      snapshot.forEach(child=>{
        levels.push(Number(child.val()));
      });
    } else {
      alert('No data found.');
    }
  })
  .catch((error) => {
    alert('unsuccessful, error' + error);
  });
  return levels;
}