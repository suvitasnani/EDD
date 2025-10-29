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
let pointText = document.getElementById('pointVal')
const buttons = [document.getElementById('item1'), document.getElementById('item2'), document.getElementById('item3'), 
    document.getElementById('item4'), document.getElementById('item5'), document.getElementById('item6'),
    document.getElementById('item7'), document.getElementById('item8'), document.getElementById('item9'), 
    document.getElementById('item10'), document.getElementById('item11'), document.getElementById('item12'), 
    document.getElementById('item13'), document.getElementById('item14'), document.getElementById('item15')]
let pointVals = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10]
let points = 0
let currentUser = null;  


class BuyListener {
    constructor(num){
        this.num = num
    }

    handleEvent(anEvent){
    console.log(this.num)
    getUserName();
    let number = parseInt(this.num) - 1
    console.log("points: " + points)
    console.log("buying: " + number)
    if(points > pointVals[number]) {
        points = points - pointVals[number];
        update(ref(db, 'users/' + currentUser.uid), {
            points: points
        })
        update(ref(db, 'users/' + currentUser.uid + '/inventoryOn'), {
            [number]: true
          })
          .then(()=> {
            alert('Bought successfully!');
          })
          .catch((error)=>{
            alert('There was an error. Error: ' + error);
          });
        update(ref(db, 'users/' + currentUser.uid + '/inventoryOff'), {
            [number]: false
          })
          .then(()=> {
           
          })
          .catch((error)=>{
            alert('There was an error. Error: ' + error);
          });
        refresh();
    } else {
        alert("Not enough points!")
    }
}}
             


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
    points = await getPoints();
    pointText.innerText = "Points: " + points

    for(let i=0; i<15; i++){
        // const newButton = buttons[i].cloneNode(true); // 'true' clones all child nodes as well
        // buttons[i].parentNode.replaceChild(newButton, buttons[i]);
        console.log(buttons[i].getAttribute("descriptor"))
        buttons[i].addEventListener('click', new BuyListener(buttons[i].getAttribute("descriptor")))
    }

    let inventoryOn = await getInventoryOn(currentUser.uid);
    let inventoryOff = await getInventoryOff(currentUser.uid);

    inventoryOn.forEach((identity) => {
        identity.classList.replace('buy', 'removeIt');
        identity.classList.replace('add', 'removeIt');
        identity.innerText = "In Inventory. Remove temporarily?";
        identity.onclick = removeIt(identity.getAttribute("descriptor"));
    });
    inventoryOff.forEach((identity) => {
        identity.classList.replace('buy', 'add');
        identity.classList.replace('removeIt', 'add');
        identity.innerText = "Bought already. Add to Inventory?";
        identity.onclick = add(identity.getAttribute("descriptor"));
    });
  }
}

async function refresh() {
    points = await getPoints();
    pointText.innerText = "Points: " + points
    let inventoryOn = await getInventoryOn(currentUser.uid);
    let inventoryOff = await getInventoryOff(currentUser.uid);

    inventoryOn.forEach((identity) => {
        identity.classList.replace('buy', 'removeIt');
        identity.classList.replace('add', 'removeIt');
        identity.innerText = "In Inventory. Remove temporarily?"
        identity.onclick = removeIt(identity.getAttribute("descriptor"))
    });
    inventoryOff.forEach((identity) => {
        identity.classList.replace('buy', 'add');
        identity.classList.replace('removeIt', 'add');
        identity.innerText = "Bought already. Add to Inventory?"
        identity.onclick = add(identity.getAttribute("descriptor"))
    });
}

async function getInventoryOn(userID){
    let iOn = [];
    await get(child(dbref, 'users/' + userID + '/inventoryOn')).then((snapshot)=>{
    if(snapshot.exists()){
      snapshot.forEach(child=>{
        if(child.val()) {
            iOn.push(buttons[parseInt(child.key)])
        };
      });
    } else {
      alert('No data found.');
    }
  })
  .catch((error) => {
    alert('unsuccessful, error' + error);
  });
  return iOn;
}

async function getInventoryOff(userID){
    let iOff = [];
    await get(child(dbref, 'users/' + userID + '/inventoryOff')).then((snapshot)=>{
    if(snapshot.exists()){
      snapshot.forEach(child=>{
        if(child.val()) {
            iOff.push(buttons[parseInt(child.key)])
        };
      });
    } else {
      alert('No data found.');
    }
  })
  .catch((error) => {
    alert('unsuccessful, error' + error);
  });
  return iOff;
}

async function getPoints(){
    getUserName();
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
    return points
}

async function add(num){
    getUserName();
    let number = parseInt(num) - 1
    update(ref(db, 'users/' + currentUser.uid + '/inventoryOn'), {
        [number]: true
        })
        .then(()=> {
        })
        .catch((error)=>{
        alert('There was an error. Error: ' + error);
        });
    update(ref(db, 'users/' + currentUser.uid + '/inventoryOff'), {
        [number]: false
        })
        .then(()=> {
        
        })
        .catch((error)=>{
        alert('There was an error. Error: ' + error);
        });
    refresh();
}
async function removeIt(num){
    getUserName();
    let number = parseInt(num) - 1
    update(ref(db, 'users/' + currentUser.uid + '/inventoryOn'), {
        [number]: false
        })
        .then(()=> {
        })
        .catch((error)=>{
        alert('There was an error. Error: ' + error);
        });
    update(ref(db, 'users/' + currentUser.uid + '/inventoryOff'), {
        [number]: true
        })
        .then(()=> {
        
        })
        .catch((error)=>{
        alert('There was an error. Error: ' + error);
        });
    refresh();
}