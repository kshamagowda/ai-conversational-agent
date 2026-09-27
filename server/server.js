const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();
const db = require("./database/database");
const authRoutes = require("./routes/authRoutes");
const protectedRoutes = require("./routes/protectedRoutes");
const conversationRoutes = require("./routes/conversationRoutes");
const messageRoutes = require("./routes/messageRoutes");

const app = express();

// Serve frontend files
app.use(express.static("client"));

const PORT = process.env.PORT || 5000;
// Rate limiting
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests. Please try again later."
    }
});

app.use("/api", apiLimiter);

// Security middleware
app.use(helmet());

// Allow frontend to communicate with backend
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5000"
}));
// Parse JSON request bodies
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/conversations", messageRoutes);
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