const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ⭐ Handle /api prefix (Ingress path-based)
app.use((req, res, next) => {
    if (req.url.startsWith("/api")) {
        req.url = req.url.replace("/api", "") || "/";
    }
    next();
});

const DATA_FILE = "/data/users.json";

let users = [];
let idCounter = 1;

// Load data
if (fs.existsSync(DATA_FILE)) {
    try {
        users = JSON.parse(fs.readFileSync(DATA_FILE));
        idCounter = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    } catch {
        users = [];
    }
}

// Save data
function saveData() {
    fs.writeFileSync(DATA_FILE, JSON.stringify(users));
}

// 🏠 HOME PAGE
app.get("/", (req, res) => {
    let rows = users.map(user => `
    <tr>
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>
            <a href="/update?id=${user.id}">Edit</a>
            <form method="POST" action="/delete/${user.id}" style="display:inline;">
                <button>Delete</button>
            </form>
        </td>
    </tr>
    `).join("");

    res.send(`
    <h1>Home</h1>
    <a href="/add">Add User</a>
    <table border="1">
    <tr><th>ID</th><th>Name</th><th>Action</th></tr>
    ${rows}
    </table>
    `);
});

// ➕ ADD PAGE
app.get("/add", (req, res) => {
    res.send(`
    <h1>Add User</h1>
    <form method="POST" action="/add">
        <input name="name" required />
        <button>Add</button>
    </form>
    <a href="/">Back</a>
    `);
});

app.post("/add", (req, res) => {
    users.push({ id: idCounter++, name: req.body.name });
    saveData();
    res.redirect("/");
});

// ✏️ UPDATE PAGE
app.get("/update", (req, res) => {
    const user = users.find(u => u.id == req.query.id);

    res.send(`
    <h1>Update User</h1>
    <form method="POST" action="/update">
        <input type="hidden" name="id" value="${user.id}" />
        <input name="name" value="${user.name}" required />
        <button>Update</button>
    </form>
    <a href="/">Back</a>
    `);
});

app.post("/update", (req, res) => {
    users = users.map(u =>
        u.id == req.body.id ? { ...u, name: req.body.name } : u
    );
    saveData();
    res.redirect("/");
});

// ❌ DELETE
app.post("/delete/:id", (req, res) => {
    users = users.filter(u => u.id != req.params.id);
    saveData();
    res.redirect("/");
});

// ❤️ Health
app.get("/health", (req, res) => res.send("OK"));

app.listen(4000, "0.0.0.0", () => {
    console.log("Server running on port 4000");
});