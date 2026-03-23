const express = require("express");
const { Pool } = require("pg");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔥 PostgreSQL Connection
const pool = new Pool({
    user: "pammu",
    host: "postgres-service.default.svc.cluster.local",
    database: "testdb",
    password: "pammu123",
    port: 5432
});

// 🌟 Middleware
app.use((req, res, next) => {
    console.log(`📥 ${new Date().toLocaleString()} | ${req.method} ${req.url}`);
    next();
});

// 🚀 UI PAGE
app.get("/", async (req, res) => {
    const result = await pool.query("SELECT * FROM users ORDER BY id");

    let rows = result.rows.map(user => `
        <tr>
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>
                <form method="POST" action="/delete/${user.id}" style="display:inline;">
                    <button>❌ Delete User</button>
                </form>
            </td>
        </tr>
    `).join("");

    res.send(`
        <html>
        <head>
            <title>CRUD App</title>
            <style>
                body {
                    font-family: Arial;
                    background: #1e3c72;
                    color: white;
                    text-align: center;
                }
                table {
                    margin: auto;
                    border-collapse: collapse;
                    width: 50%;
                }
                th, td {
                    border: 1px solid white;
                    padding: 10px;
                }
                input {
                    padding: 8px;
                    margin: 5px;
                }
                button {
                    padding: 8px 15px;
                    cursor: pointer;
                }
                .box {
                    margin: 20px;
                }
            </style>
        </head>
        <body>

            <!-- 🔥 VERSION CHANGE -->
            <h1>🚀 AKS CRUD App - VERSION 75 ✅</h1>

            <div class="box">
                <form method="POST" action="/add">
                    <input type="text" name="name" placeholder="Enter Name" required />
                    <button>Add User</button>
                </form>
            </div>

            <h2>Users</h2>
            <table>
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
});

// ➕ ADD
app.post("/add", async (req, res) => {
    const { name } = req.body;
    await pool.query("INSERT INTO users (name) VALUES ($1)", [name]);
    res.redirect("/");
});

// ❌ DELETE
app.post("/delete/:id", async (req, res) => {
    const { id } = req.params;
    await pool.query("DELETE FROM users WHERE id=$1", [id]);
    res.redirect("/");
});

// 🌍 Health
app.get("/health", (req, res) => {
    res.json({ status: "OK" });
});

const PORT = 4000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
});