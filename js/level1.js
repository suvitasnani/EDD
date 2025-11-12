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
let letterArray = [[[528.5,312.25],[529.5,310.75],[530.5,310.25],[532.5,309.25],[537.5,308.25],[540.5,306.75],[545.5,305.25],[551,301.75],[555.5,298.75],[560.5,297.75],[564,295.75],[568,292.25],[570,290.25],[572,288.75],[574,286.75],[580,283.75],[581.5,283.25],[584.5,281.75],[587,279.25],[590.5,275.75],[593,273.75],[595,272.25],[597,270.75],[598.5,269.25],[602,267.25],[604,265.25],[606,263.75],[607.5,262.25],[610.5,258.75],[612,255.25],[614,252.75],[615.5,250.75],[616.5,249.25],[619.5,244.25],[621.5,241.25],[624,236.75],[626,232.25],[628.5,229.25],[632,224.25],[634.5,220.75],[636.5,216.75],[639.5,210.75],[643.5,205.25],[646,201.75],[648,198.75],[649,196.75],[651.5,190.75],[655,185.75],[657.5,183.75],[660.5,181.25],[663,178.75],[667.5,173.25],[670.5,169.25],[672.5,165.75],[674,163.75],[676,161.75],[679,158.25],[681.5,155.75],[684.5,152.25],[688.5,149.25],[691.5,146.25],[694.5,143.75],[696,141.75],[697.5,140.25],[699.5,138.75],[702.5,136.25],[705,134.75],[708.5,132.75],[711.5,131.25],[714,129.75],[717,127.75],[719,126.75],[720.5,126.25],[722,125.25],[724,125.25],[726,125.25],[728.5,124.75],[731,124.25],[733.5,123.75],[736.5,123.25],[738.5,122.75],[740,122.25],[741.5,121.75],[743.5,121.75],[745,121.25],[746.5,121.25],[748,121.25],[750,120.75],[754,120.25],[756.5,119.75],[758.5,119.75],[760,119.75],[762,119.75],[763.5,119.75],[764.5,119.25],[765.5,119.25],[766.5,119.25],[768,119.25],[769,119.75],[769.5,119.75],[770,119.75],[770.5,119.25],[771.5,119.25],[773,119.25],[774.5,119.75],[776,120.75],[777.5,120.75],[778.5,120.75],[779,120.75],[779.5,120.75],[780.5,120.75],[781,120.75],[782,121.25],[782.5,121.25],[783.5,121.75],[785,122.75],[786,122.75],[787,122.75],[788.5,122.75],[789.5,122.75],[791.5,123.25],[793,123.25],[795,123.25],[796.5,123.75],[799,124.25],[800,125.25],[800.5,125.75],[801.5,126.75],[802,127.75],[804,128.75],[805,129.75],[805.5,130.75],[806.5,131.25],[807,132.75],[807.5,134.25],[808,135.75],[808,136.75],[808.5,138.25],[809,139.75],[809,141.25],[809,142.25],[809.5,142.75],[810,143.75],[810,145.25],[810.5,145.75],[810.5,147.25],[810.5,148.25],[811,150.25],[811.5,151.25],[812,152.75],[812.5,153.75],[813,155.25],[813,156.75],[813.5,157.75],[813.5,158.75],[813.5,159.75],[813.5,161.75],[813.5,162.75],[813.5,163.75],[813.5,164.75],[813.5,165.25],[813.5,166.75],[813.5,167.75],[813.5,169.25],[813.5,170.25],[813.5,172.25],[813.5,173.25],[813.5,174.75],[813.5,175.75],[813,177.25],[813,179.25],[812,180.75],[812,182.25],[811,183.75],[810.5,184.75],[809.5,186.75],[809.5,188.25],[809.5,189.25],[809.5,190.25],[810,191.75],[810,192.75],[810,193.75],[810,194.75],[809.5,196.75],[809.5,198.25],[809,199.25],[809,200.25],[809,201.75],[808.5,203.25],[808,204.25],[808,204.75],[808,205.25],[807.5,205.75],[807.5,206.25],[807.5,206.75],[807.5,207.25],[807,208.75],[807,210.25],[806,214.75],[805,217.75],[804.5,220.25],[803.5,221.75],[803,223.75],[803,225.25],[802.5,226.25],[802.5,227.75],[802,229.25],[801.5,230.75],[801,232.75],[800.5,234.25],[800.5,235.75],[799.5,239.25],[799,241.75],[798.5,243.75],[797.5,245.75],[796.5,248.25],[796,249.75],[795,251.75],[794,254.25],[793,257.75],[792.5,259.75],[792,261.75],[791.5,263.25],[790.5,264.75],[790,266.75],[789,268.25],[788.5,269.75],[788,270.75],[787,272.25],[786,274.75],[785,276.75],[784,278.75],[783.5,280.25],[782.5,281.75],[782,283.75],[781.5,285.25],[780.5,287.25],[780,288.25],[778.5,289.75],[778,290.25],[777,291.25],[776,291.75],[775,292.75],[772.5,294.25],[771,295.25],[770,296.25],[769,297.25],[767.5,298.75],[767,299.25],[766,299.75],[765.5,300.25],[764,301.25],[763.5,301.75],[762.5,302.25],[762,302.75],[761,303.25],[760,303.75],[759.5,303.75],[758.5,303.75],[758,303.75],[757,303.75],[755.5,304.75],[754.5,305.25],[753.5,305.25],[752,305.75],[750.5,305.75],[749.5,305.75],[748.5,306.25],[747,306.25],[746,306.75],[744.5,307.25],[744,307.75],[743,307.75],[742.5,307.75],[741.5,307.75],[740.5,308.25],[739.5,308.25],[738.5,308.75],[737.5,309.25],[735.5,309.75],[734.5,309.75],[734,309.75],[733.5,309.25],[732.5,309.25],[731.5,309.25],[730.5,309.25],[729,309.25],[727,309.25],[725.5,308.75],[724.5,309.25],[723.5,309.25],[722.5,309.25],[721,309.25],[719.5,309.25],[718.5,309.25],[717.5,308.75],[716,308.75],[714,308.25],[712.5,308.25],[710.5,307.75],[708.5,307.25],[706,306.25],[703.5,304.75],[702,303.75],[701,302.25],[699.5,301.25],[697.5,299.25],[695.5,298.25],[694,296.75],[691.5,295.75],[687,294.25],[684,293.25],[683,292.25],[682,291.25],[680.5,289.75],[678.5,288.75],[676.5,287.25],[675,285.75],[673.5,283.75],[671.5,281.75],[668.5,276.75],[665.5,273.25],[662.5,270.75],[660.5,268.75],[657,266.75],[655,264.25],[654,261.75],[652,257.25],[651.5,255.25],[651,250.75],[650.5,248.25],[650,246.25],[650,243.75],[649.5,239.25],[649,236.25],[648.5,233.25],[648.5,230.75],[648.5,228.75],[648.5,225.75],[648,223.25],[648,221.25],[648,218.75],[647.5,215.75],[647,211.75],[647,209.25],[647,207.25],[647.5,205.25],[647.5,202.75],[648,201.75],[648,200.25],[648,199.25],[648.5,198.75],[648.5,198.25],[649,197.25],[649,196.75],[649,196.25],[648.5,195.25],[648,195.25],[648,194.75],[647.5,195.25],[647,196.25],[647,196.75],[647,197.75],[647,198.75],[647,199.75],[647,200.25],[646.5,200.75],[646.5,201.75],[646.5,202.25],[646.5,203.25],[646,204.25],[645.5,206.25],[645,207.25],[645,208.25],[645.5,209.25],[645.5,210.75],[646.5,212.25],[647,213.75],[647,214.75],[647.5,215.75],[647.5,217.75],[647.5,218.75],[647.5,220.25],[648,221.25],[648.5,222.75],[648.5,223.75],[649,224.25],[649.5,225.25],[649.5,226.25],[649.5,227.75],[650,229.25],[650,230.25],[650.5,231.25],[650.5,232.25],[651,233.25],[651,234.75],[651,235.75],[651.5,237.25],[651.5,239.25],[652,240.25],[652,240.75],[652.5,241.75],[652.5,242.75],[652.5,244.75],[653,246.25],[653,247.75],[653,249.25],[653,252.25],[652.5,254.75],[652.5,256.75],[652.5,258.75],[653,260.25],[653.5,262.25],[653.5,263.25],[654,263.75],[654.5,264.25],[654.5,265.75],[655,266.25],[655.5,267.25],[656,268.25],[656.5,268.75],[657.5,269.75],[658,270.75],[659,271.75],[659.5,272.75],[660.5,274.75],[661,276.25],[662,278.25],[663,280.25],[663.5,282.25],[664.5,284.75],[666,286.25],[667,287.25],[668.5,287.75],[670,288.25],[671.5,288.75],[673,288.75],[674,289.25],[675,289.75],[676,290.25],[676.5,290.75],[677,291.25],[678,291.25],[679,291.75],[679.5,291.75],[680.5,292.25],[681,292.75],[681.5,293.25],[682.5,294.25],[683.5,295.25],[685,295.75],[686,296.25],[687,296.75],[688,297.75],[689,298.75],[689.5,299.75],[690.5,300.75],[692,301.75],[692.5,302.25],[693,302.75],[693.5,302.75],[694,303.25],[695,304.25],[695.5,304.25],[696.5,304.75],[697.5,304.75],[698.5,305.25],[699.5,305.25],[700,305.25],[701,305.25],[701.5,305.25],[702.5,305.75],[704.5,306.25],[706,306.25],[707.5,306.75],[709,306.75],[710.5,306.75],[712,306.75],[713,306.25],[714,305.75],[715.5,305.75],[717,305.75],[718,305.25],[719,305.25],[720,305.25],[721.5,304.25],[722.5,304.25],[724,303.75],[725,303.75],[727.5,303.25],[729.5,302.75],[732,302.75],[734,302.75],[736,302.75],[738,302.25],[738.5,302.25],[739,302.25],[739.5,301.75],[740.5,301.25],[741.5,300.75],[742.5,300.25],[743.5,300.25],[745,299.75],[746.5,299.25],[747.5,298.75],[748.5,298.25],[749.5,297.75],[751,297.25],[753,296.25],[754.5,295.75],[756,295.25],[757,295.25],[758.5,295.25],[759.5,294.75],[760.5,294.25],[761,293.75],[762,293.25],[763,292.75],[764.5,292.25],[765.5,291.75],[766.5,291.25],[768.5,290.25],[770,289.75],[771.5,289.25],[773,288.75],[774.5,287.75],[776.5,286.75],[777.5,285.75],[779,284.25],[780,283.25],[781.5,281.25],[782,279.25],[783,277.25],[783.5,275.25],[784.5,273.25],[785.5,270.25],[786,268.75],[787,267.75],[788,266.25],[789,263.25],[789.5,261.75],[790.5,260.25],[791,258.75],[791.5,256.25],[793,253.25],[794,251.75],[795,250.25],[796.5,249.25],[797.5,248.25],[798,247.25],[798.5,247.25],[798.5,246.75],[799,246.75],[799.5,246.75],[799.5,247.25],[799.5,247.75],[799.5,248.75],[799.5,250.75],[799,253.25],[799,255.25],[798.5,257.25],[798.5,260.25],[798.5,263.25],[798.5,265.25],[798.5,267.25],[799,268.75],[799,270.25],[799.5,272.75],[799.5,274.25],[800,275.25],[800,276.75],[801,278.25],[801.5,279.25],[802,280.25],[803,281.25],[803.5,283.25],[804,284.25],[804,285.75],[804.5,286.75],[805,287.75],[805.5,288.75],[806,288.75],[806.5,289.25],[807,289.25],[808,289.75],[809,290.25],[809.5,290.75],[810.5,291.25],[811,291.75],[812.5,292.25],[813.5,292.75],[814.5,293.75],[815.5,294.25],[817,294.75],[819,295.75],[820,296.25],[821,296.75],[822,297.25],[823.5,297.75],[824.5,298.25],[825.5,298.75],[826.5,299.75],[827.5,299.75],[828.5,300.25],[830,300.25],[831,300.75],[832,300.75],[833.5,300.75],[835.5,301.25],[837,301.75],[839,301.75],[841,302.25],[843.5,302.75],[845,302.75],[846.5,303.25],[849,303.25],[853.5,303.25],[859,302.75],[865,302.75],[869.5,302.75],[874.5,303.25],[884,303.25],[889.5,303.25],[894,303.25],[898,303.75],[903.5,303.75],[909,303.75],[911.5,303.75],[914,303.25],[915.5,303.25],[917,303.75],[918,303.75],[918.5,303.75],[919,303.75],[917.5,305.25],[915.5,306.25],[914,307.25],[913.5,307.75],[913.5,307.25]]];
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



