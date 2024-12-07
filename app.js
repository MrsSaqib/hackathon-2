// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore, collection, getDocs, addDoc, query, where, getDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBj3Szw9LmGNSjdgrM3AylyrkHLe_KZGNU",
  authDomain: "online-classes-9dd3c.firebaseapp.com",
  projectId: "online-classes-9dd3c",
  storageBucket: "online-classes-9dd3c.firebasestorage.app",
  messagingSenderId: "72668153771",
  appId: "1:72668153771:web:93d5dabea4ff6345ccb4ee",
  measurementId: "G-X1LXVHDPZF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Signup function
function signup(event) {
  event.preventDefault(); // Prevent default form submission
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const name = document.getElementById("name").value;
  const role = document.querySelector("input[name='role']:checked")?.value;

  if (!email || !password) {
    alert("Please fill out both email and password fields.");
    return;
  }

  if (password.length < 6) {
    alert("Password should be at least 6 characters long.");
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      const user = userCredential.user;
      console.log("User signed up:", user);
      
      // Save user data in Firestore
      await writeData(name, email, role);
      console.log("User stored in database.");

      alert("Sign up successful! Welcome, " + user.email);
      // Redirect after signup
      window.location.pathname = "users.html";
    })
    .catch((error) => {
      console.error("Error signing up:", error.code, error.message);
      alert("Error: " + error.message);
    });
}

// Function to write data to Firestore
async function writeData(name, email, role) {
  try {
    const docRef = await addDoc(collection(db, "users"), {
      name,
      email,
      role,
    });
    console.log("Document written with ID:", docRef.id);
  } catch (error) {
    console.error("Error adding document:", error);
  }
}

// Attach event listener to signup button
document.getElementById("signupButton")?.addEventListener("click", signup);

// Fetch all users
async function getAllUsers() {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    const users = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

// Fetch a user by email
async function getUserByEmail(email) {
  try {
    const q = query(collection(db, "users"), where("email", "==", email));
    const querySnapshot = await getDocs(q);
    const user = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))[0];
    console.log("Fetched user:", user);
    return user;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    return null;
  }
}





// Profile photo upload functionality
const profilePhotoImg = document.getElementById("profilePhotoImg");
const profilePhotoInput = document.getElementById("profilePhotoInput");

profilePhotoImg?.addEventListener("click", () => {
  profilePhotoInput.click();
});

profilePhotoInput?.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      profilePhotoImg.src = reader.result;
    };
    reader.readAsDataURL(file);
  }
});

async function displayUsers() {
  const users = await getAllUsers();
  const usersList = document.getElementById("usersList");

  if (users.length > 0) {
    usersList.innerHTML = "";
    users.forEach((user) => {
      const userDiv = document.createElement("div");
      userDiv.classList.add("user");
      userDiv.innerHTML = `
        <h3>${user.name}</h3>
        <p>Email: ${user.email}</p>
        <p>Role: ${user.role}</p>
      `;
      usersList.appendChild(userDiv);
    });
  } else {
    usersList.innerHTML = "No users found.";
  }
}


// Login and Registration form handling
function registration(event) {
  event.preventDefault(); // Prevent default form submission
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phoneNumber = document.getElementById("phoneNumber").value;
  const password = document.getElementById("password").value;
  const cpassword = document.getElementById("cpassword").value;

  let regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]{8,15}$/;

  if (password !== cpassword) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Passwords don't match!",
    });
  } else if (!regex.test(password)) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: `Password must meet the required criteria.`,
    });
  } else {
    Swal.fire({
      icon: "success",
      title: `Your Account has been Created`,
      showConfirmButton: false,
      timer: 1500,
    });
    setTimeout(() => {
      window.location.href = "./Quiz-App/index.html";
    }, 2500);
  }

  var userData = {
    name,
    email,
    phoneNumber,
    password,
    cpassword,
  };
  localStorage.setItem("userData", JSON.stringify(userData));
}

function login(event) {
  event.preventDefault(); // Prevent default form submission
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const getData = localStorage.getItem("userData");
  const parseData = JSON.parse(getData);
  if (parseData?.email !== email) {
    Swal.fire({
      icon: "error",
      title: "Invalid Email...",
      text: "Try another email",
    });
  } else if (parseData?.password !== password) {
    Swal.fire({
      icon: "error",
      title: "Incorrect Password",
      footer: '<a href="./index.html">Forgot password?</a>',
    });
  } else {
    Swal.fire({
      icon: "success",
      title: "Login Successful",
      showConfirmButton: false,
      timer: 1500,
    });
    setTimeout(() => {
      window.location.href = "./Quiz-App/index.html";
    }, 2000);
  }
}

function getLocalData() {
  const getData = localStorage.getItem("userData");
  const parseData = JSON.parse(getData);
  const getLocalDataDiv = document.getElementById("getLocalDataDiv");

  if (getLocalDataDiv && parseData) {
    getLocalDataDiv.innerHTML = `
      <ul>
         <li>Name: ${parseData.name}</li>
         <li>Email: ${parseData.email}</li>
         <li>Phone Number: ${parseData.phoneNumber}</li>
      </ul>
    `;
  }
}

function redirect() {
  window.location.href = "../index.html";
}

getLocalData();
