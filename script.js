/* GLOBAL VARIABLE FOR EXACT COORDS */
let currentCoords = "";

/* LOGIN */
function login() {
    let user = document.getElementById("username").value;

    if (user) {
        document.getElementById("loginPage").style.display = "none";
        document.getElementById("mainApp").classList.remove("hidden");
        document.getElementById("userDisplay").innerText = "Welcome, " + user;
        loadComplaints();
    } else {
        alert("Enter username");
    }
}

/* NAVIGATION */
function showSection(section) {
    document.getElementById("formSection").classList.toggle("hidden", section !== "form");
    document.getElementById("trackSection").classList.toggle("hidden", section !== "track");
}

/* GET LOCATION (NAME + EXACT COORDS) */
function getLocation() {
    if (!navigator.geolocation) {
        alert("Geolocation not supported");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async (pos) => {
            let lat = pos.coords.latitude;
            let lon = pos.coords.longitude;

            // Save exact coordinates
            currentCoords = lat + "," + lon;

            try {
                let res = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
                );

                let data = await res.json();

                let place = data.address.city 
                          || data.address.town 
                          || data.address.village 
                          || data.address.suburb 
                          || "Location";

                let state = data.address.state || "";
                let country = data.address.country || "";

                document.getElementById("location").value =
                    `${place}, ${state}, ${country}`;

            } catch (err) {
                console.log(err);
                document.getElementById("location").value = lat + ", " + lon;
            }
        },
        () => {
            alert("Please allow location access");
        }
    );
}

/* SUBMIT COMPLAINT */
function submitComplaint() {
    let name = document.getElementById("name").value;
    let category = document.getElementById("category").value;
    let complaint = document.getElementById("complaint").value;
    let location = document.getElementById("location").value;

    if (!name || !complaint) {
        alert("Fill all fields");
        return;
    }

    let complaints = JSON.parse(localStorage.getItem("complaints")) || [];

    let newComplaint = {
        id: "C" + Math.floor(Math.random() * 10000),
        name,
        category,
        complaint,
        location,          // readable location
        coords: currentCoords, // exact GPS coords
        status: "Pending"
    };

    complaints.push(newComplaint);

    localStorage.setItem("complaints", JSON.stringify(complaints));

    alert("Complaint Submitted Successfully!");

    loadComplaints();
}

/* LOAD COMPLAINTS */
function loadComplaints() {
    let list = document.getElementById("complaintList");
    list.innerHTML = "";

    let complaints = JSON.parse(localStorage.getItem("complaints")) || [];

    complaints.forEach((c, i) => {

        let li = document.createElement("li");

        // Use EXACT coordinates for map
        let mapLink = c.coords 
            ? `https://www.google.com/maps?q=${c.coords}`
            : "#";

        li.className = "card";

        li.innerHTML = `
            <b>ID:</b> ${c.id}<br>
            <b>Category:</b> ${c.category}<br>
            <b>Issue:</b> ${c.complaint}<br>
            📍 <b>Location:</b> ${c.location || "Not provided"}<br>
            <a href="${mapLink}" target="_blank">📌 View Exact Location</a><br><br>
            <span class="status ${c.status === 'Pending' ? 'pending-status' : 'resolved-status'}">
                ${c.status}
            </span>
            <br><br>
            <button onclick="resolveComplaint(${i})">Mark Resolved</button>
        `;

        list.appendChild(li);
    });

    updateDashboard();
}

/* RESOLVE */
function resolveComplaint(index) {
    let complaints = JSON.parse(localStorage.getItem("complaints"));
    complaints[index].status = "Resolved";

    localStorage.setItem("complaints", JSON.stringify(complaints));

    loadComplaints();
}

/* DASHBOARD */
function updateDashboard() {
    let complaints = JSON.parse(localStorage.getItem("complaints")) || [];

    document.getElementById("total").innerText = complaints.length;

    document.getElementById("pending").innerText =
        complaints.filter(c => c.status === "Pending").length;

    document.getElementById("resolved").innerText =
        complaints.filter(c => c.status === "Resolved").length;
}

/* SEARCH */
function searchComplaint() {
    let input = document.getElementById("search").value.toLowerCase();

    let items = document.querySelectorAll("#complaintList li");

    items.forEach(item => {
        item.style.display =
            item.innerText.toLowerCase().includes(input) ? "" : "none";
    });
}
