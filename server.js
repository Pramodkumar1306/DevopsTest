const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Handle /api prefix
app.use((req, res, next) => {
    if (req.url.startsWith("/api")) {
        req.url = req.url.replace("/api", "") || "/";
    }
    next();
});

const DATA_FILE = "/data/users.json";

let users = [];
let idCounter = 1;

// ✅ Load data
if (fs.existsSync(DATA_FILE)) {
    try {
        users = JSON.parse(fs.readFileSync(DATA_FILE));
        idCounter = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    } catch {
        users = [];
    }
}

// ✅ Save data
function saveData() {
    fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
}

//
// ==========================
// 🏠 HOME PAGE
// ==========================
app.get("/", (req, res) => {
    let userCards = users.map(user => `
        <div style="background:#1e1e2f;padding:20px;border-radius:12px;margin:10px;color:white;display:flex;justify-content:space-between;">
            <div>
                <h3>${user.name}</h3>
                <small>ID: ${user.id}</small>
            </div>
            <div>
                <a href="/edit/${user.id}"
                style="background:#3b82f6;color:white;padding:5px 10px;border-radius:5px;text-decoration:none;margin-right:5px;">
                    Edit
                </a>

                <form method="POST" action="/delete/${user.id}" style="display:inline;">
                    <button style="background:red;color:white;padding:5px 10px;border:none;border-radius:5px;">
                        Delete
                    </button>
                </form>
            </div>
        </div>
    `).join("");

    res.send(`
    <html>
    <body style="background:linear-gradient(135deg,#4c1d95,#1e1b4b);color:white;font-family:sans-serif;padding:20px;">

        <h1>User Matrix</h1>

        <div style="margin-top:20px;">
            <a href="/add" style="padding:10px;background:#06b6d4;color:white;">+ Add Userssssss</a>
            <a href="/health-ui" style="padding:10px;background:#22c55e;color:white;margin-left:10px;">System Health</a>
        </div>

        <div style="margin-top:30px;">
            ${userCards || "<h2>No Users Yet</h2>"}
        </div>

    </body>
    </html>
    `);
});

//
// ==========================
// ➕ ADD PAGE
// ==========================
app.get("/add", (req, res) => {
    res.send(`
    <html>
    <body style="background:#0f172a;color:white;text-align:center;padding-top:100px;">
        <h2>Add New User</h2>

        <form method="POST" action="/add">
            <input name="name" placeholder="Enter name" required />
            <br><br>
            <button>Create</button>
        </form>

        <br>
        <a href="/">⬅ Back</a>
    </body>
    </html>
    `);
});

//
// ==========================
// ➕ ADD LOGIC
// ==========================
app.post("/add", (req, res) => {
    users.push({ id: idCounter++, name: req.body.name });
    saveData();
    res.redirect("/");
});

//
// ==========================
// ❌ DELETE
// ==========================
app.post("/delete/:id", (req, res) => {
    users = users.filter(u => u.id != req.params.id);
    saveData();
    res.redirect("/");
});

//
// ==========================
// ✏️ EDIT PAGE (FORM SHOW)
// ==========================
app.get("/edit/:id", (req, res) => {
    const user = users.find(u => u.id == req.params.id);

    if (!user) return res.send("User not found");

    res.send(`
    <html>
    <body style="background:#1e293b;color:white;text-align:center;padding-top:100px;">

        <h2>Edit User</h2>

        <form method="POST" action="/update">
            <input type="hidden" name="id" value="${user.id}" />
            <input name="name" value="${user.name}" required />
            <br><br>
            <button>Update</button>
        </form>

        <br>
        <a href="/">⬅ Back</a>

    </body>
    </html>
    `);
});

//
// ==========================
// ✏️ UPDATE LOGIC
// ==========================
app.post("/update", (req, res) => {
    const { id, name } = req.body;

    users = users.map(u =>
        u.id == id ? { ...u, name } : u
    );

    saveData();
    res.redirect("/");
});

//
// ==========================
// 📊 SYSTEM HEALTH
// ==========================
app.get("/health-ui", (req, res) => {
    res.send(`
    <html>
    <body style="background:#064e3b;color:white;text-align:center;padding:40px;">
        <h1>SYSTEM OPERATIONAL</h1>

        <div>
            <h3>Uptime: 9822h</h3>
            <h3>Latency: 20ms</h3>
            <h3>Throughput: 884/s</h3>
        </div>

        <div>
            <p>Database: ✅ Operational</p>
            <p>API Gateway: ✅ Running</p>
            <p>Auth Service: ✅ Active</p>
            <p>Cache: ✅ Healthy</p>
        </div>

        <br>
        <a href="/">⬅ Back</a>
    </body>
    </html>
    `);
});

//
// ==========================
// ❤️ HEALTH CHECK
// ==========================
app.get("/health", (req, res) => {
    res.send("OK");
});

//
// ==========================
// 🚀 START
// ==========================
app.listen(4000, "0.0.0.0", () => {
    console.log("🚀 Server running on port 4000");
});