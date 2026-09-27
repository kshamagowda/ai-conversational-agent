const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const db = require("./database/database");
const authRoutes = require("./routes/authRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// Allow frontend to communicate with backend
app.use(cors());

// Parse JSON request bodies
app.use(express.json());
app.use("/api/auth", authRoutes);
// Basic health-check endpoint
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "AI Conversational Agent API is running",
        timestamp: new Date().toISOString()
    });
});

// Database test endpoint
app.get("/api/database-test", (req, res) => {
    try {
        const result = db.prepare("SELECT 1 AS connected").get();

        res.json({
            success: true,
            message: "Database connection is working",
            database: result
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Database connection failed"
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});