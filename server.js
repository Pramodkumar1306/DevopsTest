const express = require("express");
const { Pool } = require("pg");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Azure PostgreSQL Connection
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: false
    }
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
    background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
    color: white;
    margin: 0;
}

/* 🔥 NAVBAR */
.navbar {
    background: rgba(0,0,0,0.3);
    padding: 15px;
    display: flex;
    justify-content: space-between;
    backdrop-filter: blur(10px);
}

.logo {
    font-size: 20px;
    font-weight: bold;
    color: #00dbde;
}

/* HEADER */
.header {
    text-align: center;
    margin-top: 20px;
}

.header h1 {
    font-size: 2.5rem;
    background: linear-gradient(90deg, #00dbde, #fc00ff);
    -webkit-background-clip: text;
    color: transparent;
}

/* CONTAINER */
.container {
    width: 70%;
    margin: auto;
}

/* CARD */
.card {
    background: rgba(255,255,255,0.08);
    padding: 20px;
    border-radius: 15px;
    backdrop-filter: blur(15px);
    box-shadow: 0 10px 30px rgba(0,0,0,0.4);
    margin-top: 20px;
    animation: fadeIn 1s ease;
}

/* INPUT */
input {
    padding: 10px;
    border-radius: 8px;
    border: none;
    width: 60%;
}

/* BUTTONS */
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

/* TABLE */
table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
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
    background: rgba(255,255,255,0.2);
}

/* SEARCH */
.search-box {
    margin-top: 15px;
}

/* FOOTER */
.footer {
    text-align: center;
    margin: 20px;
    opacity: 0.7;
}

/* ANIMATION */
@keyframes fadeIn {
    from {opacity:0; transform:translateY(-20px);}
    to {opacity:1; transform:translateY(0);}
}
</style>

<script>
function filterUsers() {
    let input = document.getElementById("search").value.toLowerCase();
    let rows = document.querySelectorAll("table tr");

    rows.forEach((row, index) => {
        if(index === 0) return;
        let name = row.children[1].innerText.toLowerCase();
        row.style.display = name.includes(input) ? "" : "none";
    });
}
</script>

</head>

<body>

<!-- 🔥 NAVBAR -->
<div class="navbar">
    <div class="logo">🚀 AKS App</div>
    <div>Users: ${result.rows.length}</div>
</div>

<!-- HEADER -->
<div class="header">
    <h1>AKS CRUD Dashboard 🔥</h1>
</div>

<div class="container">

    <!-- ADD USER -->
    <div class="card">
        <form method="POST" action="/add">
            <input type="text" name="name" placeholder="Enter name..." required />
            <button class="btn add-btn">➕ Add</button>
        </form>
    </div>

    <!-- SEARCH -->
    <div class="card">
        <input type="text" id="search" placeholder="🔍 Search user..." onkeyup="filterUsers()" />
    </div>

    <!-- TABLE -->
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

</div>

<div class="footer">
⚡ Azure DevOps + Docker + AKS ⚡
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