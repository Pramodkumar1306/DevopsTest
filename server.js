const express = require("express");
const app = express();

// 🌟 Middleware for logging requests
app.use((req, res, next) => {
    console.log(`📥 ${new Date().toLocaleString()} | ${req.method} ${req.url}`);
    next();
});

// 🚀 Home Route
app.get("/", (req, res) => {

    const currentTime = new Date().toLocaleString();
    const version = "v2.0.1";

    res.send(`
        <html>
            <head>
                <title>AKS Pipeline App</title>
                <style>
                    body {
                        margin: 0;
                        padding: 0;
                        background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
                        color: white;
                        font-family: 'Segoe UI', sans-serif;
                        text-align: center;
                    }

                    .container {
                        margin-top: 80px;
                        animation: fadeIn 1.5s ease-in-out;
                    }

                    h1 {
                        font-size: 3.5rem;
                        margin-bottom: 10px;
                    }

                    p {
                        font-size: 1.3rem;
                        margin: 10px 0;
                        opacity: 0.9;
                    }

                    .card {
                        margin: 30px auto;
                        padding: 20px;
                        width: 60%;
                        border-radius: 15px;
                        background: rgba(255, 255, 255, 0.1);
                        backdrop-filter: blur(10px);
                        box-shadow: 0 8px 20px rgba(0,0,0,0.3);
                    }

                    .badge {
                        margin-top: 20px;
                        padding: 10px 25px;
                        background: linear-gradient(45deg, #00c6ff, #0072ff);
                        border-radius: 25px;
                        display: inline-block;
                        font-weight: bold;
                        color: white;
                    }

                    .footer {
                        margin-top: 40px;
                        font-size: 0.9rem;
                        opacity: 0.7;
                    }

                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(-20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }

                    .pulse {
                        animation: pulse 2s infinite;
                    }

                    @keyframes pulse {
                        0% { transform: scale(1); }
                        50% { transform: scale(1.05); }
                        100% { transform: scale(1); }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1 class="pulse">🚀 AKS CI/CD Pipeline</h1>

                    <div class="card">
                        <p>✅ Deployment Status: <b>SUCCESS</b></p>
                        <p>🔄 Auto Deployment: <b>Working Perfectly</b></p>
                        <p>📦 Version: <b>${version}</b></p>
                        <p>⏱ Last Updated: <b>${currentTime}</b></p>
                    </div>

                    <div class="badge">
                        🔥 Azure DevOps + Docker + AKS 🔥
                    </div>

                    <div class="footer">
                        Powered by Kubernetes | Zero Downtime Deployment 🚀
                    </div>
                </div>
            </body>
        </html>
    `);
});

// 🌍 Health Check Route (for Kubernetes)
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        time: new Date(),
        service: "AKS Pipeline App"
    });
});

const PORT = 4000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
});