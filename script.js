// Firebase Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, addDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 🔴 PASTE YOUR CONFIG HERE
const firebaseConfig = {
  apiKey: "AIzaSyBLFqM1AxLEamy5k53oKM_UQiAJK_35ZhI",
    authDomain: "smartcitygrievance1.firebaseapp.com",
    projectId: "smartcitygrievance1",
    storageBucket: "smartcitygrievance1.firebasestorage.app",
    messagingSenderId: "636358481922",
    appId: "1:636358481922:web:09d57ccf80951345a46f1b",
    measurementId: "G-4KGBX5EHJX"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let currentCoords = "";

/* LOGIN */
window.login = function () {
    let user = document.getElementById("username").value;

    if (user) {
        document.getElementById("loginPage").style.display = "none";
        document.getElementById("mainApp").classList.remove("hidden");
        document.getElementById("userDisplay").innerText = "Welcome " + user;
        loadComplaints();
    }
};

/* GET LOCATION */
window.getLocation = function () {
    navigator.geolocation.getCurrentPosition((pos) => {
        let lat = pos.coords.latitude;
        let lon = pos.coords.longitude;

        currentCoords = lat + "," + lon;
        document.getElementById("location").value = currentCoords;
    });
};

/* SUBMIT */
window.submitComplaint = async function () {
    let name = document.getElementById("name").value;
    let complaint = document.getElementById("complaint").value;
    let location = document.getElementById("location").value;

    if (!name || !complaint) {
        alert("Fill all fields");
        return;
    }

    await addDoc(collection(db, "complaints"), {
        name,
        complaint,
        location,
        coords: currentCoords,
        status: "Pending"
    });

    alert("Saved!");
    loadComplaints();
};

/* LOAD */
async function loadComplaints() {
    let list = document.getElementById("complaintList");
    list.innerHTML = "";

    const querySnapshot = await getDocs(collection(db, "complaints"));

    querySnapshot.forEach((doc) => {
        let data = doc.data();

        let li = document.createElement("li");

        li.innerHTML = `
            ${data.name} - ${data.complaint}<br>
            📍 ${data.location}<br>
            <button onclick="showMap('${data.coords}')">View Location</button>
        `;

        list.appendChild(li);
    });
}

/* MAP VIEW */
window.showMap = function (coords) {
    document.getElementById("mapFrame").src =
        `https://maps.google.com/maps?q=${coords}&z=15&output=embed`;

    document.getElementById("mapContainer").classList.remove("hidden");
};
