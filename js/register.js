// This JS file is for registering a new app user ---------------------------//

// ----------------- Firebase Setup & Initialization ------------------------//
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } 
  from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

// Import the functions you need from the SDKs you need
  import { getDatabase, ref, set, update, child, get } 
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

// ---------------- Register New User --------------------------------//

document.getElementById('submitData').onclick = function() {
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const userSchool = document.getElementById('userSchool').value; 
  const email = document.getElementById('userEmail').value;

  // Firebase requires a password of at least 6 characters
  const password = document.getElementById('userPass').value;

  // Validate user inputs
  if(!validation(firstName, lastName,userSchool, email, password)){
    return;
  };

  // Create new app user using email/password auth
  createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Create user credential
    const user = userCredential.user;
    
    // Add user account info to realtime database
    // set - will create a new ref. or completely replace exisitng one
    // Each new user will be placed under the 'users' node
    set(ref(db, 'users/' + user.uid), {
      points: 0
    })
    set(ref(db, 'users/' + user.uid + '/accountInfo'), {
      uid: user.uid,    // save userID fo rhome.js reference
      userSchool: userSchool,
      email: email,
      password: encryptPass(password),
      firstname: firstName,
      lastname: lastName
    })
    set(ref(db, 'users/' + user.uid + '/inventoryOff'), {
        0: false,
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
        7: false,
        8: false,
        9: false,
        10: false,
        11: false,
        12: false,
        13: false,
        14: false
      })
      set(ref(db, 'users/' + user.uid + '/inventoryOn'), {
        0: false,
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
        7: false,
        8: false,
        9: false,
        10: false,
        11: false,
        12: false,
        13: false,
        14: false
      })
      set(ref(db, 'users/' + user.uid + '/levels'), {
        lvl1: 0,
        lvl2: 0,
        lvl3: 0,
        lvl4: 0,
        lvl5: 0
      })
  })
  .then(() => {
    // Data saved successfully!
    alert('User created successfully! Please sign in.');
  })
  .catch((error) => {
    // Data write failed...
    alert(error);
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert(errorMessage);
  });
}


// --------------- Check for null, empty ("") or all spaces only ------------//
function isEmptyorSpaces(str){
  return str === null || str.match(/^ *$/) !== null
}

// ---------------------- Validate Registration Data -----------------------//
function validation(firstName, lastName, userSchool, email, password){
  let fNameRegex = /^[a-zA-Z]+$/;
  let lNameRegex = /^[a-zA-Z]+$/;
  let schoolRegex = /^[a-zA-Z]+$/; 
  let emailRegex = /^[a-zA-Z]+@ctemc\.org$/;

  if(isEmptyorSpaces(firstName) || isEmptyorSpaces(lastName) || isEmptyorSpaces(userSchool) ||
  isEmptyorSpaces(email) || isEmptyorSpaces(password)){
    alert("Please complete all fields.");
    return false;
  }
  if(!fNameRegex.test(firstName)){
    alert("The first name should only contain letters.");
    return false;
  }
  if(!lNameRegex.test(lastName)){
    alert("The last name should only contain letters.");
    return false;
  }
  if(!schoolRegex.test(userSchool)){
    alert("The school should only contain letters.")
  }
  if(!emailRegex.test(email)){
    alert("Please enter a valid email.");
    return false;
  }
  return true;
}

// --------------- Password Encryption -------------------------------------//
function encryptPass(password){
  let encrypted = CryptoJS.AES.encrypt(password, password);
  return encrypted.toString();
}