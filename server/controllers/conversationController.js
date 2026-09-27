const db = require("../database/database");

const createConversation = (req, res) => {
    try {
        const userId = req.user.userId;
        const { title } = req.body;

        const conversationTitle =
            title && title.trim()
                ? title.trim()
                : "New Conversation";

        const result = db
            .prepare(`
                INSERT INTO conversations (user_id, title)
                VALUES (?, ?)
            `)
            .run(userId, conversationTitle);

        const conversation = db
            .prepare(`
                SELECT id, user_id, title, created_at, updated_at
                FROM conversations
                WHERE id = ?
            `)
            .get(result.lastInsertRowid);

        res.status(201).json({
            success: true,
            message: "Conversation created successfully",
            conversation
        });

    } catch (error) {
        console.error("Create conversation error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create conversation"
        });
    }
};


const getConversations = (req, res) => {
    try {
        const userId = req.user.userId;

        const conversations = db
            .prepare(`
                SELECT id, title, created_at, updated_at
                FROM conversations
                WHERE user_id = ?
                ORDER BY updated_at DESC
            `)
            .all(userId);

        res.json({
            success: true,
            conversations
        });

    } catch (error) {
        console.error("Get conversations error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve conversations"
        });
    }
};


const getConversation = (req, res) => {
    try {
        const userId = req.user.userId;
        const conversationId = req.params.id;

        const conversation = db
            .prepare(`
                SELECT id, user_id, title, created_at, updated_at
                FROM conversations
                WHERE id = ? AND user_id = ?
            `)
            .get(conversationId, userId);

        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: "Conversation not found"
            });
        }

        const messages = db
            .prepare(`
                SELECT id, role, content, latency_ms, created_at
                FROM messages
                WHERE conversation_id = ?
                ORDER BY created_at ASC, id ASC
            `)
            .all(conversationId);

        res.json({
            success: true,
            conversation,
            messages
        });

    } catch (error) {
        console.error("Get conversation error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve conversation"
        });
    }
};


const deleteConversation = (req, res) => {
    try {
        const userId = req.user.userId;
        const conversationId = req.params.id;

        const result = db
            .prepare(`
                DELETE FROM conversations
                WHERE id = ? AND user_id = ?
            `)
            .run(conversationId, userId);

        if (result.changes === 0) {
            return res.status(404).json({
                success: false,
                message: "Conversation not found"
            });
        }

        res.json({
            success: true,
            message: "Conversation deleted successfully"
        });

    } catch (error) {
        console.error("Delete conversation error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete conversation"
        });
    }
};


module.exports = {
    createConversation,
    getConversations,
    getConversation,
    deleteConversation
};