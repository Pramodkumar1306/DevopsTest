const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.send("🚀 Hello from AKS Pipeline App! automatically code change is working ");
});

const PORT = 4000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});