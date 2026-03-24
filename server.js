const express = require("express");
const { Pool } = require("pg");

const app = express();

// 🔥 DB CONNECTION
const pool = new Pool({
    user: "azurepramod@pramod-postgres-db",   // ✅ IMPORTANT
    host: "pramod-postgres-db.postgres.database.azure.com", // ✅ use DNS
    database: "postgres",
    password: "Pa$$word1234567890",   // ✅ your actual password
    port: 5432,
    ssl: {
        rejectUnauthorized: false
    }
});

// 🌟 TEST DB CONNECTION ON START
pool.connect()
    .then(() => console.log("✅ DB Connected"))
    .catch(err => console.error("❌ DB Connection Failed:", err.message));

// 🚀 ROUTE
app.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.send(`🚀 App Working + DB Connected at ${result.rows[0].now}`);
    } catch (err) {
        console.error(err.message);
        res.send("⚠️ App Working but DB not connected");
    }
});

const PORT = 4000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});