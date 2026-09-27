const express = require("express");

const authenticateToken = require("../middleware/authMiddleware");

const {
    sendMessage,
    getMessages
} = require("../controllers/messageController");

const router = express.Router();

// All message routes require authentication
router.use(authenticateToken);

// Send/save a message
router.post("/:id/messages", sendMessage);

// Get all messages in a conversation
router.get("/:id/messages", getMessages);

module.exports = router;