const express = require("express");
const { Pool } = require("pg");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🌍 ENV DETECTION
const ENV = process.env.ENV || "DEV";

// 🎨 ENV UI COLORS
const envColor = ENV === "PROD" ? "#e74c3c" : "#f1c40f";
const envLabel = ENV === "PROD" ? "🔴 PRODUCTION" : "🟡 DEVELOPMENT";

// 🔥 DB CONNECTION
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
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

// ✅ CONNECT DB
pool.connect()
    .then(() => {
        console.log(`✅ DB Connected (${ENV})`);
        initDB();
    })
    .catch(err => console.error("❌ DB Error:", err.message));


// 🌟 HOME
app.get("/", async (req, res) => {
    const result = await pool.query("SELECT * FROM users ORDER BY id");

    let rows = result.rows.map(user => `
    <tr>
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
<title>AKS ${ENV}</title>

<style>
body {
    font-family: 'Segoe UI';
    background: linear-gradient(135deg,#141e30,#243b55);
    color:white;
    text-align:center;
}

.env-banner {
    background:${envColor};
    padding:10px;
    font-weight:bold;
    font-size:18px;
}

.container {
    width:90%;
    margin:20px auto;
}

.card {
    background:rgba(255,255,255,0.1);
    padding:20px;
    border-radius:10px;
}

input { padding:10px; margin:5px; border-radius:6px; border:none; }

.btn {
    padding:8px;
    border:none;
    border-radius:6px;
    margin:5px;
    cursor:pointer;
}

.add { background:#2ecc71; }
.edit { background:#3498db; }
.delete { background:#e74c3c; }
.update { background:#f39c12; }

table {
    width:100%;
    background:white;
    color:black;
    margin-top:20px;
}

th { background:#2c3e50; color:white; }
</style>

<script>
function editUser(id,name){
    document.getElementById("editId").value=id;
    document.getElementById("editName").value=name;
}
</script>

</head>

<body>

<div class="env-banner">${envLabel} ENVIRONMENT</div>

<div class="container">
<div class="card">

<h2>🚀 AKS CRUD (${ENV})</h2>

<form method="POST" action="/add">
    <input type="text" name="name" placeholder="Enter name" required />
    <button class="btn add">Add</button>
</form>

<h3>Update</h3>
<form method="POST" action="/update">
    <input type="hidden" id="editId" name="id"/>
    <input type="text" id="editName" name="name" required />
    <button class="btn update">Update</button>
</form>

<table border="1">
<tr>
    <th>ID</th>
    <th>Name</th>
    <th>Action</th>
</tr>
${rows}
</table>

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

// ❤️ HEALTH
app.get("/health", (req, res) => res.send("OK"));

// 🚀 START
app.listen(4000, "0.0.0.0", () => {
    console.log(`🚀 Server running (${ENV})`);
});