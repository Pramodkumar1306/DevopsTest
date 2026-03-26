const express = require("express");
const { Pool } = require("pg");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔥 DB CONNECTION
const pool = new Pool({
    user: "azurepramod",
    host: "pramod-postgres-db.postgres.database.azure.com",
    database: "postgres",
    password: "Pa$$word1234567890",
    port: 5432,
    ssl: { rejectUnauthorized: false }
});

// ✅ INIT DB
async function initDB() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL
        )
    `);
    console.log("✅ Table Ready");
}

pool.connect()
    .then(() => {
        console.log("✅ DB Connected");
        initDB();
    });

// 🌟 HOME UI
app.get("/", async (req, res) => {
    const result = await pool.query("SELECT * FROM users ORDER BY id");

    let rows = result.rows.map(user => `
    <tr class="fade">
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>
            <form method="POST" action="/delete/${user.id}" style="display:inline;">
                <button class="btn delete">🗑</button>
            </form>
            <button class="btn edit" onclick="editUser(${user.id}, '${user.name}')">✏️</button>
        </td>
    </tr>
    `).join("");

    res.send(`
<!DOCTYPE html>
<html>
<head>
<title>AKS Pro Dashboard</title>

<style>
body {
    font-family: 'Segoe UI';
    background: linear-gradient(135deg,#0f2027,#203a43,#2c5364);
    margin:0;
    color:white;
}

/* NAVBAR */
.navbar {
    background:#111;
    padding:15px;
    text-align:center;
    font-size:24px;
    font-weight:bold;
}

.navbar button {
    margin:8px;
    padding:10px 18px;
    border:none;
    border-radius:6px;
    background:#3498db;
    color:white;
    cursor:pointer;
}

.navbar button:hover {
    background:#2980b9;
}

/* PAGE SWITCH */
.page { display:none; }
.page.active { display:block; }

/* UI */
.container {
    width:90%;
    margin:30px auto;
}

.card {
    background:rgba(255,255,255,0.08);
    padding:25px;
    border-radius:12px;
    backdrop-filter: blur(10px);
    box-shadow:0px 10px 30px rgba(0,0,0,0.4);
}

input {
    padding:10px;
    border-radius:8px;
    border:none;
    margin:5px;
    width:220px;
}

.btn {
    padding:8px 12px;
    border:none;
    border-radius:8px;
    cursor:pointer;
    transition:0.3s;
}

.btn:hover {
    transform:scale(1.1);
}

.add { background:#27ae60; }
.edit { background:#2980b9; }
.delete { background:#c0392b; }
.update { background:#f39c12; }

table {
    width:100%;
    margin-top:20px;
    border-collapse:collapse;
    background:white;
    color:black;
    border-radius:10px;
    overflow:hidden;
}

th {
    background:#34495e;
    color:white;
    padding:12px;
}

td {
    padding:10px;
    text-align:center;
}

.fade {
    animation:fadeIn 0.4s ease-in;
}

@keyframes fadeIn {
    from {opacity:0;}
    to {opacity:1;}
}

.info {
    line-height:1.8;
}
</style>

<script>
function editUser(id,name){
    document.getElementById("editId").value=id;
    document.getElementById("editName").value=name;
}

function showPage(page){
    document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
    document.getElementById(page).classList.add("active");
}
</script>

</head>

<body>

<div class="navbar">
🚀 AKS PRO DASHBOARD  
<br>
<button onclick="showPage('crud')">CRUD</button>
<button onclick="showPage('info')">About CRUD</button>
</div>

<!-- ================= CRUD ================= -->
<div id="crud" class="page active">

<div class="container">
<div class="card">

<h3>➕ Add User</h3>
<form method="POST" action="/add">
    <input type="text" name="name" placeholder="Enter name" required />
    <button class="btn add">Add</button>
</form>

<h3>✏️ Update User</h3>
<form method="POST" action="/update">
    <input type="hidden" id="editId" name="id"/>
    <input type="text" id="editName" name="name" required />
    <button class="btn update">Update</button>
</form>

<table>
<tr>
    <th>ID</th>
    <th>Name</th>
    <th>Actions</th>
</tr>

${rows}

</table>

</div>
</div>

</div>

<!-- ================= INFO PAGE ================= -->
<div id="info" class="page">

<div class="container">
<div class="card info">

<h2>📘 What is CRUD?</h2>

<p>
CRUD stands for Create, Read, Update, Delete. It is the basic functionality of any database-driven application.
</p>

<h3>➕ Create</h3>
<p>Add new records into the database.</p>

<h3>📖 Read</h3>
<p>Fetch and display records.</p>

<h3>✏️ Update</h3>
<p>Modify existing records.</p>

<h3>❌ Delete</h3>
<p>Remove records permanently.</p>

<h2>⚙️ How This Works</h2>

<p>
1. User interacts with UI  
<br>2. Request goes to Express server  
<br>3. Server executes SQL query  
<br>4. Data stored in PostgreSQL  
<br>5. UI updates  
</p>

<h2>🌐 Architecture</h2>

<p>
Browser → Node.js → PostgreSQL → Response → UI
</p>

<h2>🚀 Use Cases</h2>

<p>
✔ Banking systems  
<br>✔ Admin dashboards  
<br>✔ E-commerce  
<br>✔ APIs  
</p>

</div>
</div>

</div>

</body>
</html>
`);
});

// ➕ ADD
app.post("/add", async (req, res) => {
    await pool.query("INSERT INTO users(name) VALUES($1)", [req.body.name]);
    res.redirect("/");
});

// 🔄 UPDATE
app.post("/update", async (req, res) => {
    await pool.query("UPDATE users SET name=$1 WHERE id=$2", [req.body.name, req.body.id]);
    res.redirect("/");
});

// ❌ DELETE
app.post("/delete/:id", async (req, res) => {
    await pool.query("DELETE FROM users WHERE id=$1", [req.params.id]);
    res.redirect("/");
});

// HEALTH
app.get("/health", (req, res) => res.send("OK"));

// START
app.listen(4000, "0.0.0.0", () => {
    console.log("🚀 Server running on port 4000");
});