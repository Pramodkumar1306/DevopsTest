const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.send("App is working without DB 🚀");
});

app.listen(4000, () => {
    console.log("Server running on port 4000");
});