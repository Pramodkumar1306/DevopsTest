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
    })
    .catch(err => console.error("❌ DB Error:", err.message));


// 🌟 HOME UI (ENHANCED)
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
<title>AKS Pro Dashboard   Shwetha</title>

<style>
body {
    font-family: 'Segoe UI';
    background: linear-gradient(135deg,#0f2027,#203a43,#2c5364);
    margin:0;
    color:white;
}

.navbar {
    background:#111;
    padding:15px;
    text-align:center;
    font-size:24px;
    font-weight:bold;
    letter-spacing:1px;
}

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

h3 {
    margin-top:20px;
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

.add { background:#27ae60; color:white; }
.edit { background:#2980b9; color:white; }
.delete { background:#c0392b; color:white; }
.update { background:#f39c12; color:white; }

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
    border-bottom:1px solid #ddd;
    text-align:center;
}

tr:hover {
    background:#f2f2f2;
}

.fade {
    animation:fadeIn 0.4s ease-in;
}

@keyframes fadeIn {
    from {opacity:0; transform:translateY(10px);}
    to {opacity:1; transform:translateY(0);}
}

.status {
    margin-top:15px;
    color:#2ecc71;
    font-weight:bold;
}

.badge {
    background:#2ecc71;
    padding:5px 10px;
    border-radius:20px;
    font-size:12px;
    margin-left:10px;
}

.footer {
    text-align:center;
    margin-top:20px;
    font-size:14px;
    opacity:0.7;
}
</style>

<script>
function editUser(id,name){
    document.getElementById("editId").value=id;
    document.getElementById("editName").value=name;
}
</script>

</head>

<body>

<div class="navbar">
🚀 AKS PRO DASHBOARDss
<span class="badge">LIVE</span>
</div>

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
    <input type="text" id="editName" name="name" placeholder="Edit name" required />
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

<div class="status">✅ Connected to Azure PostgreSQL</div>

<div class="footer">
⚡ Powered by AKS + Azure + DevOps Pipeline
</div>

</div>
</div>

</body>
</html>
`);
});


// ➕ ADD
app.post("/add", async (req, res) => {
    const { name } = req.body;
    if (!name) return res.send("❌ Name required");

    await pool.query("INSERT INTO users(name) VALUES($1)", [name]);
    res.redirect("/");
});

// 🔄 UPDATE
app.post("/update", async (req, res) => {
    const { id, name } = req.body;
    await pool.query("UPDATE users SET name=$1 WHERE id=$2", [name, id]);
    res.redirect("/");
});

// ❌ DELETE
app.post("/delete/:id", async (req, res) => {
    const id = req.params.id;
    await pool.query("DELETE FROM users WHERE id=$1", [id]);
    res.redirect("/");
});

// ❤️ HEALTH
app.get("/health", (req, res) => {
    res.send("OK");
});

// 🚀 START
app.listen(4000, "0.0.0.0", () => {
    console.log("🚀 Server running on port 4000");
});