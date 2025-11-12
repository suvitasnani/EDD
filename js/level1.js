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
let letterArray = [[[719,128.75],[720,128.75],[719.5,129.25],[719,129.25],[718,130.25],[716.5,130.25],[716,129.75],[715,128.75],[715,127.75],[714.5,126.25],[714,126.25],[713,125.75],[711.5,125.75],[710,125.25],[708,125.25],[705,125.25],[703.5,125.75],[701.5,126.25],[698.5,127.25],[697.5,127.75],[694.5,128.75],[692.5,129.25],[690.5,129.75],[688,130.25],[684.5,131.25],[682.5,131.75],[681,132.25],[679.5,132.25],[678,132.25],[675.5,132.75],[674,134.25],[672.5,135.25],[671,136.25],[669,137.25],[666.5,137.75],[664.5,137.75],[662.5,138.25],[661,138.25],[658.5,139.25],[657,139.75],[656,140.25],[655.5,140.75],[654,141.25],[653,141.75],[652,142.25],[651,142.75],[650,143.25],[647,144.75],[645.5,145.25],[643.5,145.25],[641.5,145.75],[639,146.25],[637,146.25],[635.5,146.75],[634,147.25],[632.5,148.25],[630,149.25],[628.5,150.25],[627,151.75],[625.5,152.75],[623,154.75],[621.5,156.25],[620,157.75],[619,159.25],[617.5,160.25],[616,161.75],[614.5,163.75],[613.5,164.75],[611.5,166.75],[611,167.25],[609,169.25],[607.5,170.75],[606.5,172.25],[605,173.75],[603,175.75],[601,177.75],[599.5,179.75],[598.5,180.75],[597.5,182.25],[596.5,184.25],[595.5,185.75],[595.5,187.25],[594.5,188.25],[594,190.75],[593.5,192.75],[593,194.75],[592.5,196.25],[592,198.25],[591.5,200.75],[591.5,202.25],[591.5,203.75],[591,204.75],[590.5,206.75],[590,207.75],[590,208.75],[589.5,209.75],[589,210.25],[588.5,211.75],[588.5,212.75],[588,214.25],[588,216.25],[588,217.75],[587.5,219.25],[587.5,220.75],[587.5,222.25],[588,223.75],[588.5,225.25],[588.5,226.25],[588.5,227.75],[589,228.75],[589.5,230.25],[590,230.75],[591,231.25],[592,231.75],[593.5,232.75],[594.5,233.25],[596,234.25],[597.5,234.75],[599,235.25],[602,235.75],[604,236.25],[606,236.75],[607.5,236.75],[609.5,236.75],[612,236.75],[614,236.25],[616,235.75],[619,235.25],[622.5,234.25],[628,233.25],[631,232.25],[633.5,230.75],[636.5,228.25],[642,224.75],[647,222.25],[650.5,218.75],[653.5,215.25],[658,210.75],[661.5,208.25],[666,205.25],[670.5,201.75],[673.5,197.25],[677,191.75],[679.5,188.75],[682.5,185.75],[686,182.25],[689.5,178.25],[693,172.25],[695.5,169.25],[697.5,166.25],[700.5,162.75],[706,157.25],[709.5,152.75],[712.5,149.75],[714.5,147.75],[716,145.75],[718,142.25],[719.5,139.75],[720.5,137.75],[721.5,135.75],[722,134.25],[723,132.75],[723.5,131.75],[724,131.25],[724,130.75],[724,130.25],[724,129.75],[724,129.25],[723,129.25],[722.5,129.75],[722,129.75],[721.5,130.25],[721,130.75],[721,131.75],[720,133.25],[719.5,134.75],[719,136.75],[718,138.75],[717,140.75],[715.5,142.75],[714.5,144.25],[714,145.25],[712,147.25],[710.5,148.75],[708.5,150.25],[706.5,151.75],[703.5,155.25],[702,157.75],[700.5,160.25],[699,162.25],[697.5,164.25],[695.5,167.25],[694.5,169.25],[693,171.25],[691.5,173.75],[689.5,176.75],[686.5,181.25],[684.5,183.25],[683,185.25],[681.5,187.25],[681,189.25],[679.5,191.25],[678.5,193.25],[677.5,194.75],[676,198.25],[675,200.25],[674,202.25],[673,204.25],[672.5,205.75],[671.5,207.75],[671,209.25],[670.5,210.75],[670,211.75],[670,213.25],[670,214.75],[670.5,216.25],[671,217.25],[671.5,218.25],[672,219.25],[673,220.75],[673.5,221.75],[674,222.75],[674,223.75],[674.5,225.25],[675,226.25],[675.5,226.75],[676,227.75],[676.5,228.25],[677,229.25],[677.5,230.25],[678,230.75],[678.5,231.25],[679,231.75],[680.5,232.25],[681,232.75],[682,233.25],[683,233.75],[684,233.75],[685.5,234.25],[686.5,234.25],[688,234.75],[689.5,235.25],[691,235.75],[692,235.75],[693,236.25],[694,236.75],[695,237.75],[695.5,238.25],[696.5,239.25],[697.5,239.75],[699,239.75],[700,239.75],[701,239.75],[702,239.75],[703,239.75],[705,238.75],[706,238.25],[707.5,238.25],[709.5,237.75],[710.5,237.25],[712.5,236.75],[714,236.25],[715,235.75],[716,235.25],[716.5,235.25],[718.5,234.25],[719.5,233.75],[720.5,233.25],[722.5,233.25],[725.5,233.25],[727.5,232.25],[730,231.25],[732,230.25],[735,228.25],[736.5,227.25],[738.5,225.75],[740,224.25],[741.5,222.75],[743.5,221.25],[745.5,219.25],[747.5,217.25],[749.5,216.25],[752.5,214.25],[754.5,212.75],[756,211.75],[757.5,211.25],[759.5,210.25],[762,208.75],[763.5,207.25],[765.5,205.75],[768,204.25],[770.5,202.25],[774.5,197.75],[777,195.25],[779,192.75],[781,190.75],[783,188.25],[785.5,185.25],[787.5,183.25],[789.5,180.75],[792,177.75],[796.5,173.25],[799,170.75],[801,168.75],[803.5,165.25],[804.5,163.75],[806,160.75],[807.5,157.25],[809,153.25],[810.5,149.75],[813,146.25],[815,144.25],[817,142.25],[818.5,140.25],[821.5,136.25],[822,134.25],[822.5,132.25],[823,130.75],[823,128.75],[823.5,127.25]]];
let moveArray = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []];
const tempMax = 100/1;
let htmlLetters = [document.getElementById('a'), document.getElementById('b'), document.getElementById('c'), document.getElementById('d'), document.getElementById('e'), document.getElementById('f'), document.getElementById('g'), document.getElementById('h'), document.getElementById('i'), 
    document.getElementById('j'), document.getElementById('k'), document.getElementById('l'), document.getElementById('m'), document.getElementById('n'), document.getElementById('o'), document.getElementById('p'), document.getElementById('q'), document.getElementById('r'), document.getElementById('s'), 
    document.getElementById('t'), document.getElementById('u'), document.getElementById('v'), document.getElementById('w'), document.getElementById('x'), document.getElementById('y'), document.getElementById('z')];
let gif = document.getElementById('gif')
let currentLetter = 0;
let alreadyDone = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]

let canvas;
let ctx;
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
        canvas = document.getElementById("gameCanvas");
        if (!canvas) {
            console.error('[level1] gameCanvas element not found');
            return;
        }
        
        ctx = canvas.getContext("2d");
        // Initialize with first letter
        updateBackgroundImage();
    // Initialize canvas
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Set up canvas drawing style
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 5;
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
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const userStroke = moveArray[currentLetter];
    const letterRef = letterArray[currentLetter];
    // If we have a non-empty stroke and also something to compare it to
    if (Array.isArray(userStroke) && userStroke.length > 0 && Array.isArray(letterRef) && letterRef.length > 0) {
        evaluateLetter(letterRef, userStroke).then(accuracy => {
            alert(`Accuracy: ${accuracy}%`);
        });
    }

    // Log the recorded points for debugging and also collection of sample letters
    if (Array.isArray(userStroke) && userStroke.length > 0) {
        console.log('Recorded letter', currentLetter, 'points:', userStroke);
        console.log('JSON:', JSON.stringify(userStroke));
    } else {
        console.warn('No stroke data recorded for letter index', currentLetter);
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
    // Background image for tracing
    const bgUrl = `Cursive Letters/lowercase_${currentLetterChar}.gif`;
    // Gradient for a opacity only way to do it i think 
    const overlay = 'linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.9))';
    canvas.style.backgroundImage = `${overlay}, url('${bgUrl}')`;
    canvas.style.backgroundSize = 'contain';
    canvas.style.backgroundRepeat = 'no-repeat';
    canvas.style.backgroundPosition = 'center center';
}

async function evaluateLetter(goodArray, userArray) {
    let tempPoints = 0
    const maxAcceptableDistance = 50; // Threshold in pixels we can change if needed
    
    for(let i=0; i < userArray.length; i++) {
        let minDistance = Infinity;
        for(let j=0; j < goodArray.length; j++) {
            let distance = Math.sqrt((userArray[i][0]-goodArray[j][0])*(userArray[i][0]-goodArray[j][0])+(userArray[i][1]-goodArray[j][1])*(userArray[i][1]-goodArray[j][1]));
            if(distance < minDistance) {
                minDistance = distance;
            }
        }
        // Scoring points based on how close the stroke is to the reference (points decrease as distance increases)
        // Note if I don't fix this only works on the reference array, we should find a way to be able to scale it
        let pointsForThisPixel = Math.max(0, (maxAcceptableDistance - minDistance) / maxAcceptableDistance);
        tempPoints += pointsForThisPixel / userArray.length;
    }
    if(tempPoints > 0.7) {
            if(htmlLetters[currentLetter]) {
                htmlLetters[currentLetter].classList.replace('waiting', 'done')
                htmlLetters[currentLetter].classList.replace('redo', 'done')
            }
            if(gif && gif.classList) {
                gif.classList.replace(`image${currentLetter-1}`,`image${currentLetter}`)
            }
        if(alreadyDone[currentLetter]) {
            trackingScore += tempMax * 0.25
        } else {
            trackingScore += tempMax * tempPoints
        }
        console.log('DONE')
        alreadyDone[currentLetter] = true
        currentLetter += 1
        
        // Check if we've completed all 26 letters
        // Do we just want to do all 26 letters on level 1?
        // Maybe we can do the level 2 for uppercase letters?
        if(currentLetter >= 26) {
            alert(`Congratulations! You've completed all letters!`);
            // Calculate final score and award points
            await setScore(Math.round(trackingScore));
            return Math.round(tempPoints * 100);
        }
        
        // Update background for the next letter
        updateBackgroundImage();
        alert(`Great! Accuracy: ${Math.round(tempPoints * 100)}%. Moving to the next letter.`);
    } else {
        console.log('REDO')
        if(htmlLetters[currentLetter]) {
            htmlLetters[currentLetter].classList.replace('waiting', 'redo')
        }
        alreadyDone[currentLetter] = true
    }
    return Math.round(tempPoints * 100);
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



