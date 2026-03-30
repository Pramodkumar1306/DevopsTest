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

// ✅ DATABASE CONNECTION (🔥 UPDATED HERE)
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

//
// ==========================
// 🏠 HOME PAGE
// ==========================
app.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM users ORDER BY id DESC");

        let userCards = result.rows.map(user => `
            <div style="background:#1e1e2f;padding:20px;border-radius:12px;margin:10px;color:white;display:flex;justify-content:space-between;">
                <div>
                    <h3>${user.name}</h3>
                    <small>ID: ${user.id}</small>
                </div>
                <div>
                    <a href="/edit/${user.id}" style="background:#3b82f6;color:white;padding:5px 10px;border-radius:5px;margin-right:5px;">
                        Edit
                    </a>
                    <form method="POST" action="/delete/${user.id}" style="display:inline;">
                        <button style="background:red;color:white;">Delete</button>
                    </form>
                </div>
            </div>
        `).join("");

        res.send(`
        <html>
        <body style="background:linear-gradient(135deg,#4c1d95,#1e1b4b);color:white;padding:20px;">
            <h1>User Matrix</h1>

            <a href="/add">+ Add User</a>
            <a href="/health-ui" style="margin-left:10px;">System Health</a>

            ${userCards || "<h2>No Users</h2>"}
        </body>
        </html>
        `);
    } catch (err) {
        res.send("❌ DB Connection Failed: " + err.message);
    }
});

//
// ➕ ADD PAGE
//
app.get("/add", (req, res) => {
    res.send(`
    <form method="POST" action="/add">
        <input name="name" required />
        <button>Add</button>
    </form>
    <a href="/">Back</a>
    `);
});

//
// ➕ ADD USER
//
app.post("/add", async (req, res) => {
    await pool.query("INSERT INTO users(name) VALUES($1)", [req.body.name]);
    res.redirect("/");
});

//
// ❌ DELETE
//
app.post("/delete/:id", async (req, res) => {
    await pool.query("DELETE FROM users WHERE id=$1", [req.params.id]);
    res.redirect("/");
});

//
// ✏️ EDIT PAGE
//
app.get("/edit/:id", async (req, res) => {
    const result = await pool.query("SELECT * FROM users WHERE id=$1", [req.params.id]);
    const user = result.rows[0];

    res.send(`
    <form method="POST" action="/update">
        <input type="hidden" name="id" value="${user.id}" />
        <input name="name" value="${user.name}" />
        <button>Update</button>
    </form>
    <a href="/">Back</a>
    `);
});

//
// ✏️ UPDATE
//
app.post("/update", async (req, res) => {
    await pool.query("UPDATE users SET name=$1 WHERE id=$2", [
        req.body.name,
        req.body.id
    ]);
    res.redirect("/");
});

//
// 📊 HEALTH UI
//
app.get("/health-ui", (req, res) => {
    res.send(`
        <h1>System Healthy ✅</h1>
        <a href="/">Back</a>
    `);
});

//
// ❤️ HEALTH CHECK
//
app.get("/health", (req, res) => {
    res.send("OK");
});

//
// 🚀 START
//
app.listen(4000, "0.0.0.0", () => {
    console.log("🚀 Server running on port 4000");
});