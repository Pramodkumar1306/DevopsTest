const express = require("express");
const { Pool } = require("pg");

const app = express();
app.use(express.json());

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

// 🚀 Home Route (UI)
app.get("/", (req, res) => {

    const currentTime = new Date().toLocaleString();
    const version = "v3.0.0";

    res.send(`
        <html>
        <head>
            <title>AKS Pipeline + DB App</title>
            <style>
                body {
                    background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
                    color: white;
                    font-family: 'Segoe UI';
                    text-align: center;
                    padding-top: 80px;
                }
                .card {
                    background: rgba(255,255,255,0.1);
                    padding: 20px;
                    border-radius: 15px;
                    width: 60%;
                    margin: auto;
                }
                a {
                    color: #00c6ff;
                    display: block;
                    margin: 10px;
                }
            </style>
        </head>
        <body>
            <h1>🚀 AKS CI/CD + DB Connected</h1>

            <div class="card">
                <p>✅ Deployment: SUCCESS</p>
                <p>📦 Version: ${version}</p>
                <p>⏱ ${currentTime}</p>

                <h3>🔥 CRUD Operations</h3>
                <a href="/init">Create Table</a>
                <a href="/add">Insert Data</a>
                <a href="/users">View Data</a>
                <a href="/update">Update Data</a>
                <a href="/delete">Delete Data</a>
            </div>
        </body>
        </html>
    `);
});

// 🔥 Create Table
app.get("/init", async (req, res) => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(50)
            )
        `);
        res.send("✅ Table Created");
    } catch (err) {
        res.send(err.message);
    }
});

// 🔥 INSERT
app.get("/add", async (req, res) => {
    try {
        await pool.query("INSERT INTO users (name) VALUES ('Spark')");
        res.send("✅ Data Inserted");
    } catch (err) {
        res.send(err.message);
    }
});

// 🔥 READ
app.get("/users", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM users");
        res.json(result.rows);
    } catch (err) {
        res.send(err.message);
    }
});

// 🔥 UPDATE
app.get("/update", async (req, res) => {
    try {
        await pool.query("UPDATE users SET name='Updated' WHERE id=1");
        res.send("✅ Updated");
    } catch (err) {
        res.send(err.message);
    }
});

// 🔥 DELETE
app.get("/delete", async (req, res) => {
    try {
        await pool.query("DELETE FROM users WHERE id=1");
        res.send("✅ Deleted");
    } catch (err) {
        res.send(err.message);
    }
});

// 🌍 Health Check
app.get("/health", (req, res) => {
    res.json({ status: "OK" });
});

const PORT = 4000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
});