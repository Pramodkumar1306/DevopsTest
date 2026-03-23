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
                        font-family: 'Segoe UI', Arial;
                        background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
                        color: white;
                        text-align: center;
                        margin: 0;
                        padding: 0;
                    }

                    h1 {
                        margin-top: 30px;
                        font-size: 2.5rem;
                        color: #00e6e6;
                    }

                    h2 {
                        color: #ffd369;
                    }

                    .box {
                        margin: 20px auto;
                        padding: 20px;
                        width: 40%;
                        background: rgba(255, 255, 255, 0.1);
                        border-radius: 15px;
                        backdrop-filter: blur(10px);
                    }

                    table {
                        margin: 20px auto;
                        border-collapse: collapse;
                        width: 60%;
                        background: rgba(255, 255, 255, 0.1);
                        border-radius: 10px;
                        overflow: hidden;
                    }

                    th {
                        background: #00adb5;
                        color: black;
                    }

                    th, td {
                        padding: 12px;
                        border-bottom: 1px solid rgba(255,255,255,0.2);
                    }

                    tr:hover {
                        background: rgba(255,255,255,0.1);
                    }

                    input {
                        padding: 10px;
                        margin: 5px;
                        border-radius: 8px;
                        border: none;
                        outline: none;
                    }

                    button {
                        padding: 10px 18px;
                        border: none;
                        border-radius: 8px;
                        background: linear-gradient(135deg, #00c6ff, #0072ff);
                        color: white;
                        font-weight: bold;
                        cursor: pointer;
                        transition: 0.3s;
                    }

                    button:hover {
                        transform: scale(1.05);
                        background: linear-gradient(135deg, #ff7e5f, #feb47b);
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