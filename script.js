function login() {
    let user = document.getElementById("username").value;

    if (user) {
        document.getElementById("loginPage").classList.add("hidden");
        document.getElementById("mainApp").classList.remove("hidden");
        document.getElementById("userDisplay").innerText = "Welcome, " + user;
        loadComplaints();
    } else {
        alert("Enter username");
    }
}

// Switch sections
function showSection(section) {
    document.getElementById("formSection").classList.toggle("hidden", section !== "form");
    document.getElementById("trackSection").classList.toggle("hidden", section !== "track");
}

// GPS LOCATION
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
            let lat = pos.coords.latitude;
            let lon = pos.coords.longitude;
            document.getElementById("location").value = lat + ", " + lon;
        }, () => {
            alert("Allow location access");
        });
    } else {
        alert("Geolocation not supported");
    }
}

// Submit complaint
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
        location,
        status: "Pending"
    };

    complaints.push(newComplaint);
    localStorage.setItem("complaints", JSON.stringify(complaints));

    alert("Complaint Submitted!");
    loadComplaints();
}

// Load complaints
function loadComplaints() {
    let list = document.getElementById("complaintList");
    list.innerHTML = "";

    let complaints = JSON.parse(localStorage.getItem("complaints")) || [];

    complaints.forEach((c, index) => {
        let li = document.createElement("li");
        li.className = "card";

        let mapLink = c.location ? `https://www.google.com/maps?q=${c.location}` : "#";

        li.innerHTML = `
            <b>ID:</b> ${c.id}<br>
            <b>${c.category}</b><br>
            ${c.complaint}<br>
            📍 ${c.location || "Not provided"}<br>
            <a href="${mapLink}" target="_blank">View on Map</a><br>
            <span class="status ${c.status === 'Pending' ? 'pending-status' : 'resolved-status'}">${c.status}</span>
            <br><br>
            <button onclick="resolveComplaint(${index})">Mark Resolved</button>
        `;

        list.appendChild(li);
    });

    updateDashboard();
}

// Resolve complaint
function resolveComplaint(index) {
    let complaints = JSON.parse(localStorage.getItem("complaints"));
    complaints[index].status = "Resolved";
    localStorage.setItem("complaints", JSON.stringify(complaints));
    loadComplaints();
}

// Dashboard
function updateDashboard() {
    let complaints = JSON.parse(localStorage.getItem("complaints")) || [];

    document.getElementById("total").innerText = complaints.length;
    document.getElementById("pending").innerText =
        complaints.filter(c => c.status === "Pending").length;
    document.getElementById("resolved").innerText =
        complaints.filter(c => c.status === "Resolved").length;
}

// Search
function searchComplaint() {
    let input = document.getElementById("search").value.toLowerCase();
    let items = document.querySelectorAll("#complaintList li");

    items.forEach(item => {
        item.style.display = item.innerText.toLowerCase().includes(input) ? "" : "none";
    });
}
