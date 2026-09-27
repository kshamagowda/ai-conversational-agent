const Database = require("better-sqlite3");
const path = require("path");

const dbPath = process.env.RAILWAY_ENVIRONMENT_NAME
    ? "/app/data/agent.db"
    : path.join(__dirname, "agent.db");

const db = new Database(dbPath);

db.pragma("foreign_keys = ON");

console.log("Database connected successfully");

module.exports = db;