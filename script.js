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

function showSection(section) {
    document.getElementById("formSection").classList.toggle("hidden", section !== "form");
    document.getElementById("trackSection").classList.toggle("hidden", section !== "track");
}

function getLocation() {
    navigator.geolocation.getCurrentPosition(pos => {
        document.getElementById("location").value =
            pos.coords.latitude + ", " + pos.coords.longitude;
    });
}

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
        status: "Pending"
    });

    localStorage.setItem("complaints", JSON.stringify(complaints));
    loadComplaints();
}

function loadComplaints() {
    let list = document.getElementById("complaintList");
    list.innerHTML = "";

    let complaints = JSON.parse(localStorage.getItem("complaints")) || [];

    complaints.forEach((c, i) => {
        let li = document.createElement("li");

        let map = c.location ? `https://maps.google.com?q=${c.location}` : "#";

        li.innerHTML = `
            <b>${c.id}</b><br>
            ${c.category}<br>
            ${c.complaint}<br>
            📍 ${c.location || "N/A"}<br>
            <a href="${map}" target="_blank">View Map</a><br>
            <span class="status ${c.status === 'Pending' ? 'pending-status':'resolved-status'}">${c.status}</span><br>
            <button onclick="resolve(${i})">Resolve</button>
        `;

        list.appendChild(li);
    });

    updateDashboard();
}

function resolve(i) {
    let complaints = JSON.parse(localStorage.getItem("complaints"));
    complaints[i].status = "Resolved";
    localStorage.setItem("complaints", JSON.stringify(complaints));
    loadComplaints();
}

function updateDashboard() {
    let c = JSON.parse(localStorage.getItem("complaints")) || [];

    document.getElementById("total").innerText = c.length;
    document.getElementById("pending").innerText = c.filter(x=>x.status==="Pending").length;
    document.getElementById("resolved").innerText = c.filter(x=>x.status==="Resolved").length;
}

function searchComplaint() {
    let val = document.getElementById("search").value.toLowerCase();
    document.querySelectorAll("#complaintList li").forEach(li => {
        li.style.display = li.innerText.toLowerCase().includes(val) ? "" : "none";
    });
}
