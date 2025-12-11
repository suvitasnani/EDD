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
    document.getElementById('item10'), document.getElementById('item11'), document.getElementById('item12')]
let pointVals = [5, 10, 15, 20, 20, 30, 15, 20, 25, 30, 25, 30]
let points = 0
let currentUser = null;  

// Buy Listener Class, handles buying items
class BuyListener {
    constructor(num){
        this.num = num
    }

    async handleEvent(anEvent){
    console.log(this.num)
    getUserName();
    let number = parseInt(this.num) - 1
    console.log("points: " + points)
    console.log("buying: " + number)
    if(points > pointVals[number]) {
        points = points - pointVals[number];
        await update(ref(db, 'users/' + currentUser.uid), {
            points: points
        })
        
        // Check if this item belongs to a category and unequip others
        const category = getItemCategory(number);
        if (category) {
            const updates = {};
            const updatesOff = {};
            for (const itemNum of category.items) {
                if (itemNum !== number) {
                    updates[itemNum] = false;
                    updatesOff[itemNum] = true;
                }
            }
            // Set other items in category to off (only if they were bought)
            await update(ref(db, 'users/' + currentUser.uid + '/inventoryOn'), updates);
        }
        
        // Now equip the purchased item
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

// Define item categories
// Helmets: items 0, 1, 2 (Bronze, Gold, Diamond)
// Shield: item 3 (Rainbow Shield) (WHY IS MAKING AN IMAGE FOR THIS SO HARD AHHHH)
// Sounds: items 4, 5, 6 (Dragon Roar, Cat's Meow, Ding)
// Backgrounds: items 7, 8, 9 (Ocean, Desert, Night)
// Text colors: items 10, 11 (Bright Blue, Purple)
const itemCategories = {
    helmets: [0, 1, 2],
    sounds: [4, 5, 6],
    backgrounds: [7, 8, 9],
    textColors: [10, 11]
};

// Get the category for an item number
function getItemCategory(itemNum) {
    for (const [category, items] of Object.entries(itemCategories)) {
        if (items.includes(itemNum)) {
            return { name: category, items: items };
        }
    }
    return null; // if item has no category 
}

// Add Listener Class, handles adding items to inventory
class AddListener {
    constructor(num){
        this.num = num
    }

    async handleEvent(anEvent){
    getUserName();
    let number = parseInt(this.num) - 1;
    
    // Check if this item belongs to a category
    const category = getItemCategory(number);
    
    if (category) {
        // Unequip all other items in the same category
        const updates = {};
        const updatesOff = {};
        for (const itemNum of category.items) {
            if (itemNum !== number) {
                updates[itemNum] = false;
                updatesOff[itemNum] = true;
            }
        }
        // Set other items in category to off
        await update(ref(db, 'users/' + currentUser.uid + '/inventoryOn'), updates);
        await update(ref(db, 'users/' + currentUser.uid + '/inventoryOff'), updatesOff);
    }
    
    // Now equip the selected item
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
}}

// Remove Listener Class, handles removing items from inventory
class RemoveListener {
    constructor(num){
        this.num = num
    }

    handleEvent(anEvent){
    getUserName();
    let number = parseInt(this.num) - 1
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
}}
     
// Create listener instances for each item
const buys = [new BuyListener(1), new BuyListener(2), new BuyListener(3), new BuyListener(4), new BuyListener(5), new BuyListener(6), new BuyListener(7), new BuyListener(8), new BuyListener(9), new BuyListener(10), new BuyListener(11), new BuyListener(12)]
const adds = [new AddListener(1), new AddListener(2), new AddListener(3), new AddListener(4), new AddListener(5), new AddListener(6), new AddListener(7), new AddListener(8), new AddListener(9), new AddListener(10), new AddListener(11), new AddListener(12)]
const removes = [new RemoveListener(1), new RemoveListener(2), new RemoveListener(3), new RemoveListener(4), new RemoveListener(5), new RemoveListener(6), new RemoveListener(7), new RemoveListener(8), new RemoveListener(9), new RemoveListener(10), new RemoveListener(11), new RemoveListener(12), new RemoveListener(13)]
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

    for(let i=0; i<12; i++){
        // buttons[i].addEventListener('click', new BuyListener(buttons[i].getAttribute("descriptor")))
        // const newButton = buttons[i].cloneNode(true); // 'true' clones all child nodes as well
        // buttons[i].parentNode.replaceChild(newButton, buttons[i]);
        console.log(buttons[i].getAttribute("descriptor"))
        buttons[i].addEventListener('click', buys[buttons[i].getAttribute("descriptor")-1])
    }

    let inventoryOn = await getInventoryOn(currentUser.uid);
    let inventoryOff = await getInventoryOff(currentUser.uid);

    // Set button states based on inventory
    inventoryOn.forEach((identity) => {
        identity.classList.replace('buy', 'removeIt');
        identity.classList.replace('add', 'removeIt');
        identity.innerText = "In Inventory. Remove temporarily?";
        identity.removeEventListener('click', buys[identity.getAttribute("descriptor")-1])
        identity.removeEventListener('click', adds[identity.getAttribute("descriptor")-1])
        identity.addEventListener('click', removes[identity.getAttribute("descriptor")-1])
    });
    inventoryOff.forEach((identity) => {
        identity.classList.replace('buy', 'add');
        identity.classList.replace('removeIt', 'add');
        identity.innerText = "Bought. Add to Inventory?";
        identity.removeEventListener('click', buys[identity.getAttribute("descriptor")-1])
        identity.removeEventListener('click', removes[identity.getAttribute("descriptor")-1])
        identity.addEventListener('click', adds[identity.getAttribute("descriptor")-1])
    });
  }
}

// Refresh function to update points and button states
async function refresh() {
    points = await getPoints();
    pointText.innerText = "Points: " + points
    let inventoryOn = await getInventoryOn(currentUser.uid);
    let inventoryOff = await getInventoryOff(currentUser.uid);

    inventoryOn.forEach((identity) => {
        identity.classList.replace('buy', 'removeIt');
        identity.classList.replace('add', 'removeIt');
        identity.innerText = "In Inventory. Remove temporarily?"
        identity.removeEventListener('click', buys[identity.getAttribute("descriptor")-1])
        identity.removeEventListener('click', adds[identity.getAttribute("descriptor")-1])
        identity.addEventListener('click', removes[identity.getAttribute("descriptor")-1])
    });
    inventoryOff.forEach((identity) => {
        identity.classList.replace('buy', 'add');
        identity.classList.replace('removeIt', 'add');
        identity.innerText = "Bought. Add to Inventory?"
        identity.removeEventListener('click', buys[identity.getAttribute("descriptor")-1])
        identity.removeEventListener('click', removes[identity.getAttribute("descriptor")-1])
        identity.addEventListener('click', adds[identity.getAttribute("descriptor")-1])
    });
}

// Function to get inventoryOn items
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

// Function to get inventoryOff items
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

// Function to get user points
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