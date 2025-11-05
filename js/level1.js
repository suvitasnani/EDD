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
let moveArray = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []];
const tempMax = 100/26;
let htmlLetters = [document.getElementById('a'), document.getElementById('b'), document.getElementById('c'), document.getElementById('d'), document.getElementById('e'), document.getElementById('f'), document.getElementById('g'), document.getElementById('h'), document.getElementById('i'), 
    document.getElementById('j'), document.getElementById('k'), document.getElementById('l'), document.getElementById('m'), document.getElementById('n'), document.getElementById('o'), document.getElementById('p'), document.getElementById('q'), document.getElementById('r'), document.getElementById('s'), 
    document.getElementById('t'), document.getElementById('u'), document.getElementById('v'), document.getElementById('w'), document.getElementById('x'), document.getElementById('y'), document.getElementById('z')];
let gif = document.getElementById('gif')
let currentLetter = 0;
let alreadyDone = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let ongoingTouches = new Map(); // Store active touches by their identifier
let drawing = false;

// Responsive dimensions
function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
}

// Get touch position relative to the canvas
function getTouchPos(touch) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
    };
}

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
    // Initialize canvas
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Set up canvas drawing style
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
        canvas.addEventListener("touchstart", handleStart);
        canvas.addEventListener("touchmove", handleMove);
        canvas.addEventListener("touchend", handleEnd);
        canvas.addEventListener("touchcancel", handleCancel);
  }
}



// taken from cited source online and combined with drawing functionality
function handleStart(evt) {
    evt.preventDefault(); // Prevent default browser scrolling/zooming
    const touches = evt.changedTouches;
    if (!touches || touches.length === 0) return;

    const touch = touches[0];
    const pos = getTouchPos(touch);

    drawing = true;
    // Storage for current letter
    moveArray[currentLetter] = [];
    moveArray[currentLetter].push([pos.x, pos.y]);

    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
}

function handleMove(evt) {
    evt.preventDefault();
    if (!drawing) return;

    // Track the primary touch
    const touches = evt.touches && evt.touches.length ? evt.touches : evt.changedTouches;
    if (!touches || touches.length === 0) return;

    const touch = touches[0];
    const pos = getTouchPos(touch);

    // Draw and record
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    if (!Array.isArray(moveArray[currentLetter])) {
        moveArray[currentLetter] = [];
    }
    moveArray[currentLetter].push([pos.x, pos.y]);
}

function handleEnd(evt) {
    evt && evt.preventDefault && evt.preventDefault();
    drawing = false;
    ctx.closePath();

    const userStroke = moveArray[currentLetter];
    const letterRef = letterArray[currentLetter];
    // If we have a non-empty stroke and also something to compare it to
    if (Array.isArray(userStroke) && userStroke.length > 0 && Array.isArray(letterRef) && letterRef.length > 0) {
        evaluateLetter(letterRef, userStroke);
    }

    if(currentLetter > 25) {
        setScore(Math.round(trackingScore));
    }
}

// Handle touch cancel event
function handleCancel(evt) {
    evt && evt.preventDefault && evt.preventDefault();
    drawing = false;
    ctx.closePath();
}

async function evaluateLetter(goodArray, userArray) {
    let tempPoints = 0
    for(i=0; i < userArray.length; i++) {
        distance = Math.sqrt((userArray[0]-goodArray[0])*(userArray[0]-goodArray[0])+(userArray[1]-goodArray[1])*(userArray[1]-goodArray[1]));
        tempPoints += (200 - distance) / 200 / userArray.length;
    }
    if(tempPoints > 0.7) {
        htmlLetters[currentLetter].classList.replace('waiting', 'done')
        htmlLetters[currentLetter].classList.replace('redo', 'done')
        gif.classList.replace(`image${currentLetter-1}`,`image${currentLetter}`)
        if(alreadyDone[currentLetter]) {
            trackingScore += tempMax * 0.25
        } else {
            trackingScore += tempMax * tempPoints
        }
        alreadyDone[currentLetter] = true
        currentLetter += 1
    } else {
        htmlLetters[currentLetter].classList.replace('waiting', 'redo')
        alreadyDone[currentLetter] = true
    }
}

// Find the closest matching letter from the reference array
// MIGHT not need this function anymore IF we are doing it one by one?
async function getClosestComparison(x, y) {
    let closestDistance = 100000;
    let closestLetter = letterArray[0];
    let closestVal = 0;
    for (let i = 0; i < letterArray.length; i++) {
        const letter = letterArray[i];
        const tempDistance = Math.sqrt((letter[0]-x)*(letter[0]-x)+(letter[1]-y)*(letter[1]-y));
        if (tempDistance < closestDistance) {
            closestDistance = tempDistance;
            closestLetter = letter;
            closestVal = i;
        }
    }
    return [closestLetter, closestVal];
}

async function setScore(score){
    await update(ref(db, 'users/' + currentUser.uid + '/levels'), {
        'lvl1': score
    }).then(()=> {})
    .catch((error)=>{
    alert('There was an error. Error: ' + error);
    });
    let points = 0
    await get(child(dbref, 'users/' + currentUser.uid + '/points')).then((snapshot)=>{
        if(snapshot.exists()){
            points = snapshot.val()
        } else {
            alert('No data found.');
        }
    })
    .catch((error) => {
        alert('unsuccessful, error' + error);
    });
    let ogpoints = points
    if(score > 95) {points += 10}
    else if(score > 90) {points += 9}
    else if(score > 85) {points += 8}
    else if(score > 80) {points += 7}
    else if(score > 75) {points += 6}
    else if(score > 70) {points += 5}
    else if(score > 65) {points += 4}
    else if(score > 60) {points += 3}
    else if(score > 55) {points += 2}
    else if(score > 50) {points += 1}
    await update(ref(db, 'users/' + currentUser.uid), {
        'points': points
    }).then(()=> {
        alert(`Congragulations! You scored ${score}% and received ${points-ogpoints} points!`);
        window.location.href='selectLevel.html';
    })
    .catch((error)=>{
        alert("There was an error. Error: " + error);
    });
}



