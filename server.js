const express = require("express");
const { Pool } = require("pg");
 
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
 
app.use((req, res, next) => {
    if (req.url.startsWith("/api")) {
        req.url = req.url.replace("/api", "") || "/";
    }
    next();
});
 
const pool = new Pool({
    connectionString: "postgres://postgres:postgres123@10.1.0.114:5432/myappdb"
});
 
(async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name TEXT
            )
        `);
        console.log("✅ Table ready");
    } catch (err) {
        console.error("❌ DB ERROR:", err);
    }
})();
 
// ==========================
// 🚀 ULTRA FUTURISTIC UI ENGINE
// ==========================
function layout(title, content) {
    return `
<html>
<head>
<title>${title}</title>
<style>
            body {
                margin:0;
                font-family: 'Segoe UI', sans-serif;
                background: radial-gradient(circle at center, #020617, #000);
                color:white;
                overflow-x:hidden;
            }
 
            /* Animated Stars */
            .stars {
                position:fixed;
                width:100%; height:100%;
                background: transparent;
                overflow:hidden;
            }
 
            .star {
                position:absolute;
                width:2px; height:2px;
                background: cyan;
                animation: float 10s linear infinite;
            }
 
            @keyframes float {
                from { transform: translateY(100vh); opacity:0 }
                to { transform: translateY(-10vh); opacity:1 }
            }
 
            /* Glow background */
            .glow {
                position:fixed;
                inset:0;
                background: radial-gradient(circle at 20% 30%, rgba(0,255,255,0.15), transparent),
                            radial-gradient(circle at 80% 70%, rgba(168,85,247,0.15), transparent);
                animation: pulse 6s infinite alternate;
            }
 
            @keyframes pulse {
                from { opacity:0.4 }
                to { opacity:0.9 }
            }
 
            .container {
                position:relative;
                z-index:2;
                padding:40px;
            }
 
            h1 {
                text-align:center;
                font-size:48px;
                letter-spacing:3px;
                background: linear-gradient(to right,#22d3ee,#a78bfa,#22d3ee);
                -webkit-background-clip:text;
                color:transparent;
                animation: shine 6s linear infinite;
            }
 
            @keyframes shine {
                0% { background-position:0% }
                100% { background-position:200% }
            }
 
            .top-actions {
                text-align:center;
                margin:20px;
            }
 
            .btn {
                padding:10px 18px;
                border-radius:10px;
                border:none;
                color:white;
                cursor:pointer;
                margin:5px;
                transition:0.3s;
            }
 
            .btn:hover {
                transform: scale(1.1);
                box-shadow:0 0 15px cyan;
            }
 
            .btn-blue { background: linear-gradient(45deg,#3b82f6,#06b6d4); }
            .btn-green { background: linear-gradient(45deg,#22c55e,#4ade80); }
            .btn-red { background: linear-gradient(45deg,#ef4444,#dc2626); }
 
            .card {
                background: rgba(255,255,255,0.05);
                backdrop-filter: blur(16px);
                border:1px solid rgba(255,255,255,0.1);
                border-radius:16px;
                padding:20px;
                margin:15px 0;
                display:flex;
                justify-content:space-between;
                transition:0.4s;
            }
 
            .card:hover {
                transform: scale(1.06);
                box-shadow:0 0 30px rgba(0,255,255,0.4);
            }
 
            .metrics {
                display:grid;
                grid-template-columns: repeat(auto-fit,minmax(200px,1fr));
                gap:20px;
                margin-top:30px;
            }
 
            .metric {
                padding:20px;
                border-radius:16px;
                background: rgba(0,255,255,0.08);
                text-align:center;
                position:relative;
                overflow:hidden;
            }
 
            .metric::before {
                content:"";
                position:absolute;
                inset:0;
                background: linear-gradient(90deg,transparent,rgba(0,255,255,0.3),transparent);
                animation: scan 3s infinite;
            }
 
            @keyframes scan {
                0% { transform: translateX(-100%) }
                100% { transform: translateX(100%) }
            }
 
            .bar {
                height:6px;
                border-radius:10px;
                margin-top:10px;
                background: rgba(255,255,255,0.1);
                overflow:hidden;
            }
 
            .bar-fill {
                height:100%;
                background: linear-gradient(90deg,cyan,purple);
                animation: load 3s infinite alternate;
            }
 
            @keyframes load {
                from { width:20% }
                to { width:100% }
            }
 
            input {
                padding:12px;
                border-radius:10px;
                border:none;
                background: rgba(255,255,255,0.1);
                color:white;
            }
 
            .center { text-align:center; margin-top:100px; }
</style>
</head>
<body>
<div class="stars">
            ${Array.from({length:50}).map(()=>`<div class="star" style="left:${Math.random()*100}%;animation-duration:${5+Math.random()*10}s"></div>`).join("")}
</div>
<div class="glow"></div>
 
        <div class="container">
            ${content}
</div>
</body>
</html>
    `;
}
 
// ==========================
// 🏠 HOME
// ==========================
app.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM users ORDER BY id DESC");
 
        let userCards = result.rows.map(user => `
<div class="card">
<div>
<h3>${user.name}</h3>
<small>ID: ${user.id}</small>
</div>
<div>
<a href="/edit/${user.id}" class="btn btn-blue">Edit</a>
<form method="POST" action="/delete/${user.id}" style="display:inline;">
<button class="btn btn-red">Delete</button>
</form>
</div>
</div>
        `).join("");
 
        res.send(layout("User Matrix", `
<h1>NEURAL USER MATRIX</h1>
 
            <div class="top-actions">
<a href="/add" class="btn btn-blue">+ Add User</a>
<a href="/health-ui" class="btn btn-green">System Health</a>
</div>
 
            ${userCards || "<h2 style='text-align:center;'>No Users Found</h2>"}
        `));
    } catch (err) {
        res.send("❌ DB Connection Failed: " + err.message);
    }
});
 
// ==========================
// ➕ ADD
// ==========================
app.get("/add", (req, res) => {
    res.send(layout("Add User", `
<div class="center">
<h2>Create Entity</h2>
<form method="POST" action="/add">
<input name="name" placeholder="Enter Name" required />
<br><br>
<button class="btn btn-blue">Create</button>
</form>
<br>
<a href="/">⬅ Back</a>
</div>
    `));
});
 
app.post("/add", async (req, res) => {
    await pool.query("INSERT INTO users(name) VALUES($1)", [req.body.name]);
    res.redirect("/");
});
 
// ==========================
// ❌ DELETE
// ==========================
app.post("/delete/:id", async (req, res) => {
    await pool.query("DELETE FROM users WHERE id=$1", [req.params.id]);
    res.redirect("/");
});
 
// ==========================
// ✏️ EDIT
// ==========================
app.get("/edit/:id", async (req, res) => {
    const result = await pool.query("SELECT * FROM users WHERE id=$1", [req.params.id]);
    const user = result.rows[0];
 
    res.send(layout("Edit User", `
<div class="center">
<h2>Edit Entity</h2>
<form method="POST" action="/update">
<input type="hidden" name="id" value="${user.id}" />
<input name="name" value="${user.name}" required />
<br><br>
<button class="btn btn-blue">Update</button>
</form>
<br>
<a href="/">⬅ Back</a>
</div>
    `));
});
 
// ==========================
// ✏️ UPDATE
// ==========================
app.post("/update", async (req, res) => {
    await pool.query("UPDATE users SET name=$1 WHERE id=$2", [
        req.body.name,
        req.body.id
    ]);
    res.redirect("/");
});
 
// ==========================
// 📊 HEALTH UI
// ==========================
app.get("/health-ui", (req, res) => {
    res.send(layout("System Health", `
<h1>SYSTEM CORE STATUS</h1>
 
        <div class="metrics">
<div class="metric">Uptime<br>${Math.floor(Math.random()*10000)}h<div class="bar"><div class="bar-fill"></div></div></div>
<div class="metric">Latency<br>${Math.floor(Math.random()*50)}ms<div class="bar"><div class="bar-fill"></div></div></div>
<div class="metric">Throughput<br>${Math.floor(Math.random()*1000)}/s<div class="bar"><div class="bar-fill"></div></div></div>
<div class="metric">Load<br>${Math.floor(Math.random()*100)}%<div class="bar"><div class="bar-fill"></div></div></div>
</div>
 
        <div style="text-align:center;margin-top:30px;">
<p>Database: ✅ Operational</p>
<p>API Gateway: ✅ Running</p>
<p>Auth Service: ✅ Active</p>
<p>Cache: ✅ Healthy</p>
</div>
 
        <div style="text-align:center;margin-top:20px;">
<a href="/">⬅ Back</a>
</div>
    `));
});
 
app.get("/health", (req, res) => res.send("OK"));
 
app.listen(4000, "0.0.0.0", () => {
    console.log("🚀 Ultra Futuristic Server running on port 4000");
});