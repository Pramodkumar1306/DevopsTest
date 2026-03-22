const express = require("express");
const app = express();

// 🌟 Middleware for logging requests
app.use((req, res, next) => {
    console.log(`📥 Request received: ${req.method} ${req.url}`);
    next();
});

// 🚀 Home Route
app.get("/", (req, res) => {
    res.send(`
        <html>
            <head>
                <title>AKS Pipeline App</title>
                <style>
                    body {
                        background: linear-gradient(135deg, #1e3c72, #2a5298);
                        color: white;
                        font-family: Arial, sans-serif;
                        text-align: center;
                        padding-top: 100px;
                    }
                    h1 {
                        font-size: 3rem;
                        animation: fadeIn 2s ease-in-out;
                    }
                    p {
                        font-size: 1.5rem;
                        margin-top: 20px;
                    }
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(-20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .badge {
                        margin-top: 30px;
                        padding: 10px 20px;
                        background: #00c6ff;
                        color: black;
                        border-radius: 20px;
                        display: inline-block;
                        font-weight: bold;
                    }
                </style>
            </head>
            <body>
                <h1>🚀 AKS CI/CD Pipeline Success</h1>
                <p>Automatic Deployment is Working Perfectly ✅</p>
                <p>Code changes are reflected instantly data added here  🔄</p>
                <div class="badge">🔥 Azure DevOps + Docker + AKS Something Updated 🔥</div>
            </body>
        </html>
    `);
});

// 🌍 Health Check Route (for Kubernetes)
app.get("/health", (req, res) => {
    res.status(200).send("OK");
});

const PORT = 4000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
});