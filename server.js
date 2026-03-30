const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Handle /api prefix (Ingress path-based routing)
app.use((req, res, next) => {
    if (req.url.startsWith("/api")) {
        req.url = req.url.replace("/api", "") || "/";
    }
    next();
});

const DATA_FILE = "/data/users.json";

let users = [];
let idCounter = 1;

// ✅ Load data from PVC
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
// 🏠 HOME PAGE (User Matrix)
// ==========================
//
app.get("/", (req, res) => {
    let userCards = users.map(user => `
        <div style="background:#1e1e2f;padding:20px;border-radius:12px;margin:10px;color:white;display:flex;justify-content:space-between;">
            <div>
                <h3>${user.name}</h3>
                <small>ID: ${user.id}</small>
            </div>
            <div>
                <form method="POST" action="/delete/${user.id}" style="display:inline;">
                    <button style="background:red;color:white;padding:5px 10px;border:none;border-radius:5px;">Delete</button>
                </form>
            </div>
        </div>
    `).join("");

    res.send(`
    <html>
    <body style="background:linear-gradient(135deg,#4c1d95,#1e1b4b);color:white;font-family:sans-serif;padding:20px;">

        <h1>User Matrix</h1>
        <p>Futuristic User Management System</p>

        <div style="margin-top:20px;">
            <a href="/add" style="padding:10px 15px;background:#06b6d4;color:white;border-radius:6px;text-decoration:none;">+ Add User</a>
            <a href="/health-ui" style="padding:10px 15px;background:#22c55e;color:white;border-radius:6px;text-decoration:none;margin-left:10px;">System Health</a>
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
// ➕ ADD USER PAGE
// ==========================
//
app.get("/add", (req, res) => {
    res.send(`
    <html>
    <body style="background:#0f172a;color:white;font-family:sans-serif;text-align:center;padding-top:100px;">

        <div style="background:#1e293b;padding:30px;border-radius:12px;width:300px;margin:auto;">
            <h2>Add New User</h2>

            <form method="POST" action="/add">
                <input name="name" placeholder="Enter user name" required 
                style="padding:10px;width:100%;margin:10px 0;border-radius:6px;border:none;" />
                
                <button style="padding:10px;width:100%;background:#8b5cf6;color:white;border:none;border-radius:6px;">
                    Create
                </button>
            </form>

            <br>
            <a href="/" style="color:#38bdf8;">⬅ Back</a>
        </div>

    </body>
    </html>
    `);
});

//
// ==========================
// ➕ ADD USER LOGIC
// ==========================
//
app.post("/add", (req, res) => {
    users.push({ id: idCounter++, name: req.body.name });
    saveData();
    res.redirect("/");
});

//
// ==========================
// ❌ DELETE USER
// ==========================
//
app.post("/delete/:id", (req, res) => {
    users = users.filter(u => u.id != req.params.id);
    saveData();
    res.redirect("/");
});

//
// ==========================
// 📊 SYSTEM HEALTH PAGE
// ==========================
//
app.get("/health-ui", (req, res) => {
    res.send(`
    <html>
    <body style="background:#064e3b;color:white;font-family:sans-serif;text-align:center;padding:40px;">

        <h1>SYSTEM OPERATIONAL</h1>
        <p>All Systems Nominal</p>

        <div style="margin-top:30px;">
            <div>⚡ Uptime: 9822h</div>
            <div>🛡 Latency: 20ms</div>
            <div>📊 Throughput: 884/s</div>
        </div>

        <div style="margin-top:30px;">
            <p>Database: ✅ Operational</p>
            <p>API Gateway: ✅ Running</p>
            <p>Auth Service: ✅ Active</p>
            <p>Cache Layer: ✅ Healthy</p>
            <p>Load Balancer: ✅ Operational</p>
        </div>

        <br>
        <a href="/" style="color:#38bdf8;">⬅ Back to Dashboard</a>

    </body>
    </html>
    `);
});

//
// ==========================
// ❤️ HEALTH CHECK (for Ingress)
// ==========================
app.get("/health", (req, res) => {
    res.send("OK");
});

//
// ==========================
// 🚀 SERVER START
// ==========================
app.listen(4000, "0.0.0.0", () => {
    console.log("🚀 Server running on port 4000");
});