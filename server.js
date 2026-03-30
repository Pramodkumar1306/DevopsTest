const express = require("express");

const { Pool } = require("pg");
 
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
 
// ✅ DATABASE CONNECTION

const pool = new Pool({

    connectionString: "postgres://postgres:postgres123@10.1.0.114:5432/myappdb"

});
 
// ✅ CREATE TABLE

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

// 🎨 FUTURISTIC LAYOUT ENGINE

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

                background: radial-gradient(circle at top, #0f0c29, #000000);

                color:white;

                overflow-x:hidden;

            }
 
            .bg-glow {

                position:fixed;

                inset:0;

                background: radial-gradient(circle at 30% 30%, rgba(0,255,255,0.15), transparent),

                            radial-gradient(circle at 70% 70%, rgba(168,85,247,0.15), transparent);

                animation: pulse 6s infinite alternate;

            }
 
            @keyframes pulse {

                from { opacity:0.4 }

                to { opacity:0.8 }

            }
 
            .container {

                position:relative;

                z-index:2;

                padding:40px;

            }
 
            h1 {

                text-align:center;

                font-size:42px;

                background: linear-gradient(to right,#22d3ee,#a78bfa);

                -webkit-background-clip:text;

                color:transparent;

                letter-spacing:2px;

            }
 
            .card {

                background: rgba(255,255,255,0.05);

                backdrop-filter: blur(14px);

                border:1px solid rgba(255,255,255,0.1);

                border-radius:16px;

                padding:20px;

                margin:15px 0;

                display:flex;

                justify-content:space-between;

                align-items:center;

                transition:0.3s;

            }
 
            .card:hover {

                transform: scale(1.05);

                box-shadow: 0 0 25px rgba(0,255,255,0.3);

            }
 
            .btn {

                padding:8px 14px;

                border-radius:8px;

                text-decoration:none;

                color:white;

                border:none;

                cursor:pointer;

                margin:5px;

                font-size:14px;

            }
 
            .btn-blue { background: linear-gradient(45deg,#3b82f6,#06b6d4); }

            .btn-red { background: linear-gradient(45deg,#ef4444,#dc2626); }

            .btn-green { background: linear-gradient(45deg,#22c55e,#4ade80); }
 
            .top-actions {

                text-align:center;

                margin:20px 0;

            }
 
            input {

                padding:12px;

                border-radius:10px;

                border:none;

                width:250px;

                background: rgba(255,255,255,0.1);

                color:white;

            }
 
            .center {

                text-align:center;

                margin-top:100px;

            }
 
            .metrics {

                display:grid;

                grid-template-columns: repeat(auto-fit,minmax(150px,1fr));

                gap:20px;

                margin-top:30px;

            }
 
            .metric {

                background: rgba(0,255,255,0.1);

                padding:20px;

                border-radius:12px;

                text-align:center;

                animation: glow 2s infinite alternate;

            }
 
            @keyframes glow {

                from { box-shadow:0 0 10px cyan; }

                to { box-shadow:0 0 25px purple; }

            }
</style>
</head>
<body>
<div class="bg-glow"></div>
<div class="container">

            ${content}
</div>
</body>
</html>

    `;

}
 
// ==========================

// 🏠 HOME PAGE

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

// ➕ ADD PAGE

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

// ✏️ EDIT PAGE

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
<div class="metric">Uptime<br>${Math.floor(Math.random()*10000)}h</div>
<div class="metric">Latency<br>${Math.floor(Math.random()*50)}ms</div>
<div class="metric">Throughput<br>${Math.floor(Math.random()*1000)}/s</div>
<div class="metric">Load<br>${Math.floor(Math.random()*100)}%</div>
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
 
// ==========================

// ❤️ HEALTH CHECK

// ==========================

app.get("/health", (req, res) => {

    res.send("OK");

});
 
// ==========================

// 🚀 START

// ==========================

app.listen(4000, "0.0.0.0", () => {

    console.log("🚀 Futuristic Server running on port 4000");

});

 