const express = require("express");

const authenticateToken = require("../middleware/authMiddleware");

const {
    createConversation,
    getConversations,
    getConversation,
    deleteConversation
} = require("../controllers/conversationController");

const router = express.Router();

// All conversation routes require authentication
router.use(authenticateToken);

// Create a new conversation
router.post("/", createConversation);

// Get all conversations for logged-in user
router.get("/", getConversations);

// Get one conversation with its messages
router.get("/:id", getConversation);

// Delete a conversation
router.delete("/:id", deleteConversation);

module.exports = router;