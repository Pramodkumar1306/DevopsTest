const express = require("express");
const { Pool } = require("pg");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔥 DB CONNECTION (AZURE POSTGRES)
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

// ✅ CREATE TABLE
async function initDB() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL
            )
        `);
        console.log("✅ Table ready");
    } catch (err) {
        console.error("❌ DB Init Error:", err.message);
    }
}

// ✅ CONNECT DB
pool.connect()
    .then(() => {
        console.log("✅ DB Connected");
        initDB();
    })
    .catch(err => console.error("❌ DB Error:", err.message));


// 🌟 LOGGING
app.use((req, res, next) => {
    console.log(`📥 ${new Date().toLocaleString()} | ${req.method} ${req.url}`);
    next();
});


// 🚀 HOME PAGE (FULL UI)
app.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM users ORDER BY id");

        let rows = result.rows.map(user => `
        <tr>
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>
                <form method="POST" action="/delete/${user.id}" style="display:inline;">
                    <button class="delete">Delete</button>
                </form>
                <button onclick="editUser(${user.id}, '${user.name}')">Edit</button>
            </td>
        </tr>
        `).join("");

        res.send(`
<!DOCTYPE html>
<html>
<head>
<title>AKS CRUD</title>

<style>
body {
    font-family: Arial;
    background: linear-gradient(135deg,#1e3c72,#2a5298);
    color:white;
    text-align:center;
}

.container {
    width:80%;
    margin:40px auto;
    background:rgba(255,255,255,0.1);
    padding:20px;
    border-radius:10px;
}

input {
    padding:10px;
    border-radius:6px;
    border:none;
}

button {
    padding:10px;
    border:none;
    border-radius:6px;
    margin:5px;
    cursor:pointer;
}

.delete {
    background:red;
    color:white;
}

table {
    width:100%;
    background:white;
    color:black;
    margin-top:20px;
}

th {
    background:#0072ff;
    color:white;
}
</style>

<script>
function editUser(id, name){
    document.getElementById("editId").value = id;
    document.getElementById("editName").value = name;
}
</script>

</head>

<body>

<div class="container">

<h1>🚀 AKS FULL CRUD APP</h1>

<!-- ADD -->
<form method="POST" action="/add">
    <input type="text" name="name" placeholder="Enter name" required />
    <button>Add User</button>
</form>

<!-- UPDATE -->
<h3>Update User</h3>
<form method="POST" action="/update">
    <input type="hidden" id="editId" name="id"/>
    <input type="text" id="editName" name="name" placeholder="Update name" required />
    <button>Update</button>
</form>

<!-- TABLE -->
<table border="1">
<tr>
    <th>ID</th>
    <th>Name</th>
    <th>Action</th>
</tr>

${rows}

</table>

</div>

</body>
</html>
        `);

    } catch (err) {
        res.send("❌ Error: " + err.message);
    }
});


// ➕ ADD
app.post("/add", async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.send("❌ Name required");
        }

        await pool.query("INSERT INTO users(name) VALUES($1)", [name]);

        res.redirect("/");
    } catch (err) {
        res.send("❌ Add error");
    }
});


// 🔄 UPDATE
app.post("/update", async (req, res) => {
    try {
        const { id, name } = req.body;

        await pool.query("UPDATE users SET name=$1 WHERE id=$2", [name, id]);

        res.redirect("/");
    } catch (err) {
        res.send("❌ Update error");
    }
});


// ❌ DELETE
app.post("/delete/:id", async (req, res) => {
    try {
        const id = req.params.id;

        await pool.query("DELETE FROM users WHERE id=$1", [id]);

        res.redirect("/");
    } catch (err) {
        res.send("❌ Delete error");
    }
});


// ❤️ HEALTH CHECK
app.get("/health", (req, res) => {
    res.send("OK");
});


// 🚀 START SERVER
app.listen(4000, "0.0.0.0", () => {
    console.log("🚀 Server running on port 4000");
});