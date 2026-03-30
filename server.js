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
    fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
}

// 🏠 HOME PAGE
app.get("/", (req, res) => {
    let rows = users.map(user => `
    <tr>
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>
            <a class="btn edit" href="/update?id=${user.id}">Edit</a>
            <form method="POST" action="/delete/${user.id}" style="display:inline;">
                <button class="btn delete">Delete</button>
            </form>
        </td>
    </tr>
    `).join("");

    res.send(`
    <html>
    <head>
        <title>User Management</title>
        <style>
            body { font-family: Arial; background:#f4f6f9; padding:20px; }
            h1 { text-align:center; }
            .container {
                max-width:800px;
                margin:auto;
                background:white;
                padding:20px;
                border-radius:10px;
                box-shadow:0 2px 10px rgba(0,0,0,0.1);
            }
            table { width:100%; border-collapse:collapse; margin-top:20px;}
            th, td { padding:12px; text-align:center; }
            th { background:#007bff; color:white; }
            tr:nth-child(even){ background:#f2f2f2;}
            .btn {
                padding:6px 12px;
                border:none;
                border-radius:5px;
                cursor:pointer;
                text-decoration:none;
                font-size:14px;
            }
            .edit { background:#28a745; color:white;}
            .delete { background:#dc3545; color:white;}
            .add {
                background:#007bff;
                color:white;
                padding:10px 15px;
                display:inline-block;
                margin-top:10px;
                border-radius:5px;
                text-decoration:none;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>👥 User Management</h1>
            <a class="add" href="/add">+ Add User</a>
            <table>
                <tr><th>ID</th><th>Name</th><th>Action</th></tr>
                ${rows}
            </table>
        </div>
    </body>
    </html>
    `);
});

// ➕ ADD PAGE
app.get("/add", (req, res) => {
    res.send(`
    <html>
    <head>
        <title>Add User</title>
        <style>
            body { font-family: Arial; background:#eef2f7; }
            .card {
                width:320px;
                margin:100px auto;
                padding:20px;
                background:white;
                border-radius:10px;
                box-shadow:0 2px 10px rgba(0,0,0,0.1);
                text-align:center;
            }
            input {
                width:100%;
                padding:10px;
                margin:10px 0;
                border-radius:5px;
                border:1px solid #ccc;
            }
            button {
                background:#007bff;
                color:white;
                padding:10px;
                border:none;
                width:100%;
                border-radius:5px;
                cursor:pointer;
            }
            a {
                display:block;
                margin-top:10px;
                text-decoration:none;
            }
        </style>
    </head>
    <body>
        <div class="card">
            <h2>Add User</h2>
            <form method="POST" action="/add">
                <input name="name" placeholder="Enter name" required />
                <button>Add</button>
            </form>
            <a href="/">⬅ Back</a>
        </div>
    </body>
    </html>
    `);
});

// ➕ ADD LOGIC
app.post("/add", (req, res) => {
    users.push({ id: idCounter++, name: req.body.name });
    saveData();
    res.redirect("/");
});

// ✏️ UPDATE PAGE
app.get("/update", (req, res) => {
    const user = users.find(u => u.id == req.query.id);

    res.send(`
    <html>
    <head>
        <title>Update User</title>
        <style>
            body { font-family: Arial; background:#eef2f7; }
            .card {
                width:320px;
                margin:100px auto;
                padding:20px;
                background:white;
                border-radius:10px;
                box-shadow:0 2px 10px rgba(0,0,0,0.1);
                text-align:center;
            }
            input {
                width:100%;
                padding:10px;
                margin:10px 0;
                border-radius:5px;
                border:1px solid #ccc;
            }
            button {
                background:#28a745;
                color:white;
                padding:10px;
                border:none;
                width:100%;
                border-radius:5px;
                cursor:pointer;
            }
            a {
                display:block;
                margin-top:10px;
                text-decoration:none;
            }
        </style>
    </head>
    <body>
        <div class="card">
            <h2>Update User</h2>
            <form method="POST" action="/update">
                <input type="hidden" name="id" value="${user.id}" />
                <input name="name" value="${user.name}" required />
                <button>Update</button>
            </form>
            <a href="/">⬅ Back</a>
        </div>
    </body>
    </html>
    `);
});

// ✏️ UPDATE LOGIC
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
    console.log("🚀 Server running on port 4000");
});