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
    ssl: {
        rejectUnauthorized: false
    }
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


// 🌟 HOME UI (ADVANCED)
app.get("/", async (req, res) => {
    const result = await pool.query("SELECT * FROM users ORDER BY id");

    let rows = result.rows.map(user => `
    <tr class="fade">
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>
            <form method="POST" action="/delete/${user.id}" style="display:inline;">
                <button class="btn delete">Delete</button>
            </form>
            <button class="btn edit" onclick="editUser(${user.id}, '${user.name}')">Edit</button>
        </td>
    </tr>
    `).join("");

    res.send(`
<!DOCTYPE html>
<html>
<head>
<title>AKS Pro CRUD</title>

<style>
body {
    font-family: 'Segoe UI';
    background: linear-gradient(135deg,#141e30,#243b55);
    margin:0;
    color:white;
}

.navbar {
    background:#111;
    padding:15px;
    text-align:center;
    font-size:22px;
    font-weight:bold;
}

.container {
    width:90%;
    margin:30px auto;
}

.card {
    background:rgba(255,255,255,0.1);
    padding:20px;
    border-radius:10px;
    box-shadow:0px 5px 20px rgba(0,0,0,0.3);
}

input {
    padding:10px;
    border-radius:6px;
    border:none;
    margin:5px;
    width:200px;
}

.btn {
    padding:8px 12px;
    border:none;
    border-radius:6px;
    cursor:pointer;
    transition:0.3s;
}

.btn:hover {
    transform:scale(1.1);
}

.add { background:#2ecc71; color:white; }
.edit { background:#3498db; color:white; }
.delete { background:#e74c3c; color:white; }
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
    background:#2c3e50;
    color:white;
    padding:10px;
}

td {
    padding:10px;
    border-bottom:1px solid #ddd;
}

tr:hover {
    background:#f2f2f2;
}

.fade {
    animation:fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
    from {opacity:0; transform:translateY(10px);}
    to {opacity:1; transform:translateY(0);}
}

.status {
    margin-top:10px;
    color:lightgreen;
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

<div class="navbar">🚀 AKS PRO CRUD DASHBOARD</div>

<div class="container">
<div class="card">

<h3>Add User</h3>
<form method="POST" action="/add">
    <input type="text" name="name" placeholder="Enter name" required />
    <button class="btn add">Add</button>
</form>

<h3>Update User</h3>
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