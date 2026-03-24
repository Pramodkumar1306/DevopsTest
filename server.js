const express = require("express");
const { Pool } = require("pg");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔥 DB CONNECTION
const pool = new Pool({
    user: "azurepramod",   // ✅ IMPORTANT
    host: "pramod-postgres-db.postgres.database.azure.com",
    database: "postgres",
    password: "Pa$$word1234567890",
    port: 5432,
    ssl: {
        rejectUnauthorized: false
    }
});

// ✅ CREATE TABLE IF NOT EXISTS
const createTable = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100)
            )
        `);
        console.log("✅ Table ready");
    } catch (err) {
        console.error("❌ Table creation error:", err.message);
    }
};

// ✅ TEST DB CONNECTION + CREATE TABLE
pool.connect()
    .then(() => {
        console.log("✅ DB Connected");
        createTable();
    })
    .catch(err => console.error("❌ DB Connection Failed:", err.message));

// 🌟 LOGGING
app.use((req, res, next) => {
    console.log(`📥 ${new Date().toLocaleString()} | ${req.method} ${req.url}`);
    next();
});


// 🚀 HOME (SAFE)
app.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM users ORDER BY id");

        let rows = result.rows.map(user => `
            <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>
                    <form method="POST" action="/delete/${user.id}">
                        <button>❌ Delete</button>
                    </form>
                </td>
            </tr>
        `).join("");

        res.send(`
        <html>
        <head>
            <title>AKS CRUD</title>
        </head>
        <body style="font-family: Arial; text-align:center; background:#1e3c72; color:white;">

            <h1>🚀 AKS CRUD App (FINAL ✅)</h1>

            <form method="POST" action="/add">
                <input type="text" name="name" placeholder="Enter Name" required />
                <button>Add User</button>
            </form>

            <h2>Users</h2>
            <table border="1" style="margin:auto;">
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Action</th>
                </tr>
                ${rows}
            </table>

        </body>
        </html>
        `);

    } catch (err) {
        console.error(err.message);
        res.send("⚠️ DB Error: " + err.message);
    }
});


// ➕ ADD USER
app.post("/add", async (req, res) => {
    try {
        const { name } = req.body;
        await pool.query("INSERT INTO users (name) VALUES ($1)", [name]);
        res.redirect("/");
    } catch (err) {
        console.error(err.message);
        res.send("❌ Error adding user");
    }
});


// ❌ DELETE USER
app.post("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM users WHERE id=$1", [id]);
        res.redirect("/");
    } catch (err) {
        console.error(err.message);
        res.send("❌ Error deleting user");
    }
});


// ❤️ HEALTH CHECK (VERY IMPORTANT FOR APP GATEWAY)
app.get("/health", (req, res) => {
    res.status(200).send("OK");
});


// 🚀 START SERVER
const PORT = 4000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
});