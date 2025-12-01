// ----------------- Page Loaded After User Sign-in -------------------------//

// ----------------- Firebase Setup & Initialization ------------------------//

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } 
  from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

// Import the functions you need from the SDKs you need
  import { getDatabase, ref, set, update, child, get, remove } 
    from "https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js";

// Import knight image selector
import { getKnightImagePath } from './knightImage.js';
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
// let letterArray = []; // DON'T NEED ARRAYS ANYMORE SINCE DOING IT ON LIKE A DEVICE BY DEVICE BASIS, CAN DELETE LATER WOOO YEAH IDK OK BYE
let currentLetterPoints = [];
let currentImage = null;
let moveArray = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []];
let allStrokes = []; // Store all strokes for the current letter (we need for the letters with multiple strokes or dots or crosses etc)
let needsClear = false; // Used to clear canvas on next stroke start (after failed attempt)
let backgroundOffset = 0; // For tracking how much the background has shifted
const tempMax = 100/1;

let htmlLetters = [document.getElementById('a'), document.getElementById('b'), document.getElementById('c'), document.getElementById('d'), document.getElementById('e'), document.getElementById('f'), document.getElementById('g'), document.getElementById('h'), document.getElementById('i'), 
    document.getElementById('j'), document.getElementById('k'), document.getElementById('l'), document.getElementById('m'), document.getElementById('n'), document.getElementById('o'), document.getElementById('p'), document.getElementById('q'), document.getElementById('r'), document.getElementById('s'), 
    document.getElementById('t'), document.getElementById('u'), document.getElementById('v'), document.getElementById('w'), document.getElementById('x'), document.getElementById('y'), document.getElementById('z')];

let gif = document.getElementById('gif')
let canvasDiv = document.getElementById('canvasDiv')
let currentLetter = 0;
let alreadyDone = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]

let roar = new Audio('sounds/roar.mp3')
let meow = new Audio('sounds/meow.mp3')
let ding = new Audio('sounds/ding.mp3')


let canvas;
let ctx;
// let ongoingTouches = new Map(); // Store active touches by their identifier
let drawing = false;
let effectArray = [];

// Responsive dimensions
function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    // Regenerate points if we have an image
    if (currentImage) {
        generateLetterPoints(currentImage);
    }
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
    effectArray = await getEffects();
    
    // Update knight image based on equipped items
    const knightImg = document.getElementById('knightImage');
    if (knightImg) {
        knightImg.src = getKnightImagePath(effectArray);
    }
    
    if(effectArray[9]){canvasDiv.classList.replace('writingContainer', 'writingContainerNight');}
    if(effectArray[8]){canvasDiv.classList.replace('writingContainer', 'writingContainerDesert')}
    if(effectArray[7]){canvasDiv.classList.replace('writingContainer', 'writingContainerOcean')}
        canvas = document.getElementById("gameCanvas");
        if (!canvas) {
            console.error('[level1] gameCanvas element not found');
            return;
        }
        
        ctx = canvas.getContext("2d");
        if(effectArray[10]) {ctx.strokeStyle = '#89BEFA';}
        if(effectArray[11]) {ctx.strokeStyle = '#54507D';}
        // Initialize with first letter
        updateBackgroundImage();
    // Initialize canvas
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Set up canvas drawing style
    ctx.strokeStyle = '#000000';
    
    if(effectArray[10]) {ctx.strokeStyle = '#89BEFA';}
    if(effectArray[11]) {ctx.strokeStyle = '#54507D';}
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

        canvas.addEventListener("touchstart", handleStart);
        canvas.addEventListener("touchmove", handleMove);
        canvas.addEventListener("touchend", handleEnd);
        canvas.addEventListener("touchcancel", handleCancel);

        // Submit button
        const submitBtn = document.getElementById('submitBtn');
        if (submitBtn) {
            submitBtn.addEventListener('click', submitLetter);
        }

        // Clear button
        const clearBtn = document.getElementById('clearBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', clearStrokes);
        }

        // Initialize background position
        updateBackgroundPosition();
  }
}

// Shift the background image by 10 pixels when the letter is correct
function shiftBackground() {
    backgroundOffset += 10;
    updateBackgroundPosition();
}

// Update the background image position
function updateBackgroundPosition() {
    const bgImage = document.getElementById('bgImage');
    if (bgImage) {
        bgImage.style.transform = `translateX(-${backgroundOffset}px)`;
        console.log('Background shifted to:', backgroundOffset, 'px');
    }
}

// Clear all strokes and reset the canvas
function clearStrokes() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    allStrokes = [];
    moveArray[currentLetter] = [];
    needsClear = false;
    console.log('Strokes cleared');
}



// taken from cited source online and combined with drawing functionality
function handleStart(evt) {
    evt.preventDefault(); // Prevent default browser scrolling/zooming
    const touches = evt.changedTouches;
    if (!touches || touches.length === 0) return;

    const touch = touches[0];
    const pos = getTouchPos(touch);

    drawing = true;
    
    // Clear canvas if previous attempt failed atttempt
    if (needsClear) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        allStrokes = []; // Clear stored strokes for fresh attempt
        needsClear = false;
    }
    
    // Set stroke color
    ctx.strokeStyle = '#000000';
    if(effectArray[10]) {ctx.strokeStyle = '#89BEFA';}
    if(effectArray[11]) {ctx.strokeStyle = '#54507D';}

    // Start a new stroke
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
    // Save current stroke to allStrokes array (we need for the letters with multiple strokes or dots or crosses etc)
    if (Array.isArray(userStroke) && userStroke.length > 0) {
        allStrokes.push([...userStroke]);
        console.log('Stroke saved. Total strokes:', allStrokes.length); // debugging reasons
    }
}


// Handle touch cancel event
function handleCancel(evt) {
    evt && evt.preventDefault && evt.preventDefault();
    drawing = false;
    ctx.closePath();
}


// Utility: Log and return the recorded stroke for a given letter index
// Shown on window for easy access for DevTools console.
function getRecordedLetter(index = currentLetter) {
    if (typeof index !== 'number' || index < 0) {
        console.warn('getRecordedLetter: invalid index', index);
        return null;
    }
    const data = moveArray[index];
    if (!Array.isArray(data) || data.length === 0) {
        console.warn('getRecordedLetter: no recorded stroke data for index', index);
        return null;
    }
    // Log as array of [x, y] pairs and as JSON for copy/paste
    console.log('Recorded letter', index, 'points:', data);
    console.log('JSON:', JSON.stringify(data));
    return data;
}


// Make available in console even if this file is loaded as a module
if (typeof window !== 'undefined') {
    window.getRecordedLetter = getRecordedLetter;
    console.info('[level1] getRecordedLetter available on window');
}


// Update background image based on current letter
function updateBackgroundImage() {
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    const currentLetterChar = letters[currentLetter];
    // Background image for tracing (with arrows and lines to make easier for user to learn)
    const bgUrl = `Cursive Letters/lowercase_${currentLetterChar}.gif`;
    // Gradient for a opacity only way to do it i think 
    const overlay = 'linear-gradient(to right, rgba(255,255,255,0), rgba(255,255,255,0.9), rgba(255,255,255,0.9), rgba(255,255,255,0))';
    canvas.style.backgroundImage = `${overlay}, url('${bgUrl}')`;
    canvas.style.backgroundSize = 'contain';
    canvas.style.backgroundRepeat = 'no-repeat';
    canvas.style.backgroundPosition = 'center center';

    // Load transparent image (no background) for grading/reference points
    const gradingImg = new Image();
    gradingImg.src = `Cusrive Letters No BG/lowercase_${currentLetterChar}.png`;
    gradingImg.onload = () => {
        currentImage = gradingImg;
        generateLetterPoints(gradingImg);
    };
}


// Generate reference points for the current letter
function generateLetterPoints(img) {
    const offCanvas = document.createElement('canvas');
    offCanvas.width = canvas.width;
    offCanvas.height = canvas.height;
    const offCtx = offCanvas.getContext('2d');

    // Clear canvas
    offCtx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Calculate contain dimensions
    const hRatio = canvas.width / img.width;
    const vRatio = canvas.height / img.height;
    const ratio = Math.min(hRatio, vRatio);
    const centerShift_x = (canvas.width - img.width * ratio) / 2;
    const centerShift_y = (canvas.height - img.height * ratio) / 2;
    
    // Draw image
    offCtx.drawImage(img, 0, 0, img.width, img.height, centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
    
    const imageData = offCtx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    currentLetterPoints = [];
    // Step size based on screen size
    const step = Math.max(2, Math.floor(Math.min(canvas.width, canvas.height) / 200));
    
    for (let y = 0; y < canvas.height; y += step) {
        for (let x = 0; x < canvas.width; x += step) {
            const i = (y * canvas.width + x) * 4;
            const r = data[i];
            const g = data[i+1];
            const b = data[i+2];
            const a = data[i+3];
            
            // Check for dark pixels (on a lighter bg)
            // If alpha is high and color is dark
            // Allows us the prorgram to makes its own reference points MEANING should working regardless of device YIPPEE!
            if (a > 50 && (r < 200 || g < 200 || b < 200)) {
                 currentLetterPoints.push([x, y]);
            }
        }
    }
    console.log(`Generated ${currentLetterPoints.length} reference points for letter.`);
}

// Redraw the stroke with a specific color
function redrawStroke(stroke, color) {
    if (!stroke || stroke.length === 0) return;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(stroke[0][0], stroke[0][1]);
    for (let i = 1; i < stroke.length; i++) {
        ctx.lineTo(stroke[i][0], stroke[i][1]);
    }
    ctx.stroke();
}

// Redraw all strokes with a specific color
function redrawAllStrokes(color) {
    for (let stroke of allStrokes) {
        redrawStroke(stroke, color);
    }
}

// Submit the letter for evaluation when submit button is pressed
function submitLetter() {
    if (allStrokes.length === 0) {
        console.warn('No strokes to submit');
        return;
    }

    // Combine all strokes into one array for evaluation
    const combinedStrokes = allStrokes.flat();
    const letterRef = currentLetterPoints;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (Array.isArray(combinedStrokes) && combinedStrokes.length > 0 && Array.isArray(letterRef) && letterRef.length > 0) {
        evaluateLetter(letterRef, combinedStrokes).then(accuracy => {
            console.log('Letter evaluated with accuracy:', accuracy); // for debugging
        });
    }

    // Log for debugging
    console.log('Submitted letter', currentLetter, 'with', allStrokes.length, 'strokes');
    console.log('Combined points:', combinedStrokes.length);
}

async function evaluateLetter(goodArray, userArray) {
    let tempPoints = 0
    let pointsOnLine = 0;
    // The acceptable distance threshold is based on the screen size
    const maxAcceptableDistance = Math.max(20, Math.min(canvas.width, canvas.height) * 0.08); // HOW STRICT IT IS, NOTE TO SELF TO TUNE IT 
    
    for(let i=0; i < userArray.length; i++) {
        let minDistance = Infinity;
        for(let j=0; j < goodArray.length; j++) {
            let distance = Math.sqrt((userArray[i][0]-goodArray[j][0])*(userArray[i][0]-goodArray[j][0])+(userArray[i][1]-goodArray[j][1])*(userArray[i][1]-goodArray[j][1]));
            if(distance < minDistance) {
                minDistance = distance;
            }
        }
        if (minDistance <= maxAcceptableDistance) {
            pointsOnLine++;
        }

        // Scoring points based on how close the stroke is to the reference (points decrease as distance increases)
        // Note if I don't fix this only works on the reference array, we should find a way to be able to scale it
        let pointsForThisPixel = Math.max(0, (maxAcceptableDistance - minDistance) / maxAcceptableDistance);
        tempPoints += pointsForThisPixel / userArray.length;
    }

    // Require minimum stroke length (prevents dots/short lines from passing, can comment out if needed for testing)
    const minStrokePoints = 50; // User must draw at least this many points
    if (userArray.length < minStrokePoints) {
        console.log(`Stroke too short: ${userArray.length} points (need ${minStrokePoints})`); // debugging
        tempPoints = 0;
    }

    // Require 90% of user's points to be on the reference letter, we can adjust if too low/high
    if (pointsOnLine < userArray.length * 0.90) {
        console.log(`Not enough points on line: ${pointsOnLine}/${userArray.length} (${Math.round(pointsOnLine/userArray.length*100)}%)`);
        tempPoints = 0;
    }

    if(tempPoints > 0.5) {
        // Redraw all strokes in green before moving on
        redrawAllStrokes('#00FF00');
        if(effectArray[4] && !effectArray[5] && !effectArray[6]){roar.play()}
        if(effectArray[5] && !effectArray[6]){meow.play()}
        if(effectArray[6]){ding.play()}
         await setTimeout(()=>{
        ctx.clearRect(0, 0, canvas.width, canvas.height);

            if(htmlLetters[currentLetter]) {
                htmlLetters[currentLetter].classList.replace('waiting', 'done')
                htmlLetters[currentLetter].classList.replace('redo', 'done')
            }
            if(gif && gif.classList) {
                if(!effectArray[0] && !effectArray[1] && !effectArray[2] && !effectArray[3]){
                    gif.classList.replace(`lvl1image${currentLetter-1}`,`lvl1image${currentLetter}`)
                }
                if(!effectArray[0] && !effectArray[1] && !effectArray[2] && effectArray[3]){
                    gif.classList.replace(`lvl1image${currentLetter-1}`, `lvl1-1image${currentLetter}`)
                    gif.classList.replace(`lvl1-1image${currentLetter-1}`, `lvl1-1image${currentLetter}`)
                }
                if(effectArray[0] && !effectArray[1] && !effectArray[2] && !effectArray[3]){
                    gif.classList.replace(`lvl1image${currentLetter-1}`, `lvl1-2image${currentLetter}`)
                    gif.classList.replace(`lvl1-2image${currentLetter-1}`, `lvl1-2image${currentLetter}`)
                }
                if(effectArray[0] && !effectArray[1] && !effectArray[2] && effectArray[3]){
                    gif.classList.replace(`lvl1image${currentLetter-1}`, `lvl1-3image${currentLetter}`)
                    gif.classList.replace(`lvl1-3image${currentLetter-1}`, `lvl1-3image${currentLetter}`)
                }
                if(effectArray[1] && !effectArray[2] && !effectArray[3]){
                    gif.classList.replace(`lvl1image${currentLetter-1}`, `lvl1.4image${currentLetter}`)
                    gif.classList.replace(`lvl1-4image${currentLetter-1}`, `lvl1.4image${currentLetter}`)
                }
                if(effectArray[1] && !effectArray[2] && effectArray[3]){
                    gif.classList.replace(`lvl1image${currentLetter-1}`, `lvl1-5image${currentLetter}`)
                    gif.classList.replace(`lvl1-5image${currentLetter-1}`, `lvl1-5image${currentLetter}`)
                }
                if(effectArray[2] && !effectArray[3]){
                    gif.classList.replace(`lvl1image${currentLetter-1}`, `lvl1-6image${currentLetter}`)
                    gif.classList.replace(`lvl1-6image${currentLetter-1}`, `lvl1-6image${currentLetter}`)
                }
                if(effectArray[2] && effectArray[3]){
                    gif.classList.replace(`lvl1image${currentLetter-1}`, `lvl1-7image${currentLetter}`)
                    gif.classList.replace(`lvl1-7image${currentLetter-1}`, `lvl1-7image${currentLetter}`)
                }
            }
        if(alreadyDone[currentLetter]) {
            trackingScore += tempMax * 0.25
        } else {
            trackingScore += tempMax * tempPoints
        }
        console.log('DONE')
        alreadyDone[currentLetter] = true
        currentLetter += 1
        allStrokes = []; // Clear strokes for next letter
        shiftBackground(); // Shift background by 10px
        if(currentLetter < 26) {
            updateBackgroundImage();
        } else {
            // Completed all 26 letters - calculate final score
            const averageScore = trackingScore / 26;
            setScore(Math.round(averageScore));
        }
        },500);
        
    } else {
        // Redraw all strokes in red
        redrawAllStrokes('#FF0000');
        console.log('REDO')
        if(htmlLetters[currentLetter]) {
            htmlLetters[currentLetter].classList.replace('waiting', 'redo')
        }
        alreadyDone[currentLetter] = true
        needsClear = true; // Shows that next stroke start should clear
    }
    return Math.round(tempPoints * 100);
}


// Find the closest matching letter from the reference array
// MIGHT not need this function anymore IF we are doing it one by one?

// Temp commenting this out for now, might comment out other stuff we aren't using as well
/*
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
*/


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

async function getEffects(){
    let effects = [];
    await get(child(dbref, 'users/' + currentUser.uid + '/inventoryOn')).then((snapshot)=>{
    if(snapshot.exists()){
        snapshot.forEach(child=>{
            effects.push(child.val());
        });
    } else {
        alert('No data found.');
    }
    })
    .catch((error) => {
    alert('unsuccessful, error' + error);
    });
    return effects;
}
