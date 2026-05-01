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

function showSection(section) {
    document.getElementById("formSection").classList.toggle("hidden", section !== "form");
    document.getElementById("trackSection").classList.toggle("hidden", section !== "track");
}

function submitComplaint() {
    let name = document.getElementById("name").value;
    let category = document.getElementById("category").value;
    let complaint = document.getElementById("complaint").value;

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
        status: "Pending"
    };

    complaints.push(newComplaint);
    localStorage.setItem("complaints", JSON.stringify(complaints));

    alert("Complaint submitted! ID: " + newComplaint.id);
    loadComplaints();
}

function loadComplaints() {
    let list = document.getElementById("complaintList");
    list.innerHTML = "";

    let complaints = JSON.parse(localStorage.getItem("complaints")) || [];

    complaints.forEach((c, index) => {
        let li = document.createElement("li");
        li.className = "card";

        li.innerHTML = `
            <b>ID:</b> ${c.id}<br>
            <b>${c.category}</b><br>
            ${c.complaint}<br>
            <span class="status ${c.status.toLowerCase()}">${c.status}</span><br><br>
            <button onclick="resolveComplaint(${index})">Mark Resolved</button>
        `;

        list.appendChild(li);
    });

    updateDashboard();
}

function resolveComplaint(index) {
    let complaints = JSON.parse(localStorage.getItem("complaints"));
    complaints[index].status = "Resolved";
    localStorage.setItem("complaints", JSON.stringify(complaints));
    loadComplaints();
}

function updateDashboard() {
    let complaints = JSON.parse(localStorage.getItem("complaints")) || [];

    document.getElementById("total").innerText = complaints.length;
    document.getElementById("pending").innerText =
        complaints.filter(c => c.status === "Pending").length;
    document.getElementById("resolved").innerText =
        complaints.filter(c => c.status === "Resolved").length;
}

function searchComplaint() {
    let input = document.getElementById("search").value.toLowerCase();
    let items = document.querySelectorAll("#complaintList li");

    items.forEach(item => {
        item.style.display = item.innerText.toLowerCase().includes(input) ? "" : "none";
    });
}