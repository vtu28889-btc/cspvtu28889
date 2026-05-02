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

/* NAV */
function showSection(section) {
    document.getElementById("formSection").classList.toggle("hidden", section !== "form");
    document.getElementById("trackSection").classList.toggle("hidden", section !== "track");
}

/* LOCATION */
function getLocation() {
    navigator.geolocation.getCurrentPosition(async (pos) => {

        let lat = pos.coords.latitude;
        let lon = pos.coords.longitude;

        currentCoords = lat + "," + lon;

        try {
            let res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
            );

            let data = await res.json();

            let place = data.address.city || data.address.town || data.address.village || "Location";

            document.getElementById("location").value = place;

        } catch {
            document.getElementById("location").value = lat + "," + lon;
        }

    });
}

/* SUBMIT */
function submitComplaint() {
    let name = document.getElementById("name").value;
    let category = document.getElementById("category").value;
    let complaint = document.getElementById("complaint").value;
    let location = document.getElementById("location").value;

    if (!name || !complaint) return alert("Fill all fields");

    let complaints = JSON.parse(localStorage.getItem("complaints")) || [];

    complaints.push({
        id: "C" + Math.floor(Math.random() * 10000),
        name,
        category,
        complaint,
        location,
        coords: currentCoords,
        status: "Pending"
    });

    localStorage.setItem("complaints", JSON.stringify(complaints));
    loadComplaints();
}

/* LOAD */
function loadComplaints() {
    let list = document.getElementById("complaintList");
    list.innerHTML = "";

    let complaints = JSON.parse(localStorage.getItem("complaints")) || [];

    complaints.forEach((c, i) => {

        let li = document.createElement("li");

        li.innerHTML = `
            <b>${c.id}</b><br>
            ${c.category}<br>
            ${c.complaint}<br>
            📍 ${c.location}<br>
            <button onclick="showMap('${c.coords}')">View Location</button><br>
            <span>${c.status}</span><br>
            <button onclick="resolve(${i})">Resolve</button>
        `;

        list.appendChild(li);
    });

    updateDashboard();
}

/* SHOW MAP INSIDE PAGE */
function showMap(coords) {
    let frame = document.getElementById("mapFrame");

    frame.src = `https://maps.google.com/maps?q=${coords}&z=15&output=embed`;

    document.getElementById("mapContainer").classList.remove("hidden");

    document.getElementById("mapContainer").scrollIntoView({ behavior: "smooth" });
}

/* RESOLVE */
function resolve(i) {
    let complaints = JSON.parse(localStorage.getItem("complaints"));
    complaints[i].status = "Resolved";

    localStorage.setItem("complaints", JSON.stringify(complaints));
    loadComplaints();
}

/* DASHBOARD */
function updateDashboard() {
    let c = JSON.parse(localStorage.getItem("complaints")) || [];

    document.getElementById("total").innerText = c.length;
    document.getElementById("pending").innerText = c.filter(x=>x.status==="Pending").length;
    document.getElementById("resolved").innerText = c.filter(x=>x.status==="Resolved").length;
}

/* SEARCH */
function searchComplaint() {
    let val = document.getElementById("search").value.toLowerCase();

    document.querySelectorAll("#complaintList li").forEach(li => {
        li.style.display = li.innerText.toLowerCase().includes(val) ? "" : "none";
    });
}
