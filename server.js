const express = require("express");
const { Pool } = require("pg");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔥 PostgreSQL Connection
const pool = new Pool({
    user: "postgres",
    host: "20.204.210.253",
    database: "postgres",
    password: "postgres",
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
                <form method="POST" action="/delete/${user.id}">
                    <button class="btn delete-btn">❌ Delete</button>
                </form>
            </td>
        </tr>
    `).join("");

    res.send(`
<html>
<head>
    <title>AKS CRUD App</title>

    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;500;700&display=swap" rel="stylesheet">

    <style>
        body {
            font-family: 'Poppins', sans-serif;
            background: linear-gradient(135deg, #141e30, #243b55);
            color: white;
            text-align: center;
            margin: 0;
            padding: 0;
        }

        h1 {
            margin-top: 30px;
            font-size: 2.8rem;
            background: linear-gradient(90deg, #00dbde, #fc00ff);
            -webkit-background-clip: text;
            color: transparent;
        }

        .container {
            width: 70%;
            margin: auto;
        }

        .card {
            background: rgba(255,255,255,0.08);
            padding: 20px;
            border-radius: 15px;
            backdrop-filter: blur(15px);
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            margin-top: 20px;
            animation: fadeIn 1s ease;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            border-radius: 10px;
            overflow: hidden;
        }

        th {
            background: #00c6ff;
            color: black;
        }

        th, td {
            padding: 12px;
        }

        tr:nth-child(even) {
            background: rgba(255,255,255,0.05);
        }

        tr:hover {
            background: rgba(255,255,255,0.15);
            transition: 0.3s;
        }

        input {
            padding: 10px;
            border-radius: 8px;
            border: none;
            outline: none;
            width: 60%;
        }

        .btn {
            padding: 10px 18px;
            border-radius: 8px;
            border: none;
            cursor: pointer;
            font-weight: bold;
            transition: 0.3s;
        }

        .add-btn {
            background: linear-gradient(135deg, #00ff87, #60efff);
            color: black;
        }

        .delete-btn {
            background: linear-gradient(135deg, #ff416c, #ff4b2b);
            color: white;
        }

        .btn:hover {
            transform: scale(1.1);
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .footer {
            margin-top: 30px;
            font-size: 14px;
            opacity: 0.7;
        }
    </style>
</head>

<body>

    <h1>🚀 AKS CRUD App - VERSION 100 🔥</h1>

    <div class="container">

        <!-- ADD USER -->
        <div class="card">
            <form method="POST" action="/add">
                <input type="text" name="name" placeholder="Enter user name..." required />
                <button class="btn add-btn">➕ Add User</button>
            </form>
        </div>

        <!-- USERS TABLE -->
        <div class="card">
            <h2>📋 Users List</h2>
            <table>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Action</th>
                </tr>
                ${rows}
            </table>
        </div>

        <div class="footer">
            ⚡ Azure DevOps + Docker + AKS ⚡
        </div>

    </div>

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