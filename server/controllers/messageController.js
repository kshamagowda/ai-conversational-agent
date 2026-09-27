const db = require("../database/database");
const { generateAIResponse } = require("../services/groqService");
const { extractMemories } = require("../services/memoryExtractor");


const sendMessage = async (req, res) => {
    try {
        const userId = req.user.userId;
        const conversationId = req.params.id;
        const { content } = req.body;

        // Validate message
        if (!content || !content.trim()) {
            return res.status(400).json({
                success: false,
                message: "Message content is required"
            });
        }

        const cleanContent = content.trim();

        // Check conversation ownership
        const conversation = db
            .prepare(`
                SELECT id
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

        // Save user message
        db.prepare(`
            INSERT INTO messages
            (conversation_id, role, content)
            VALUES (?, 'user', ?)
        `).run(conversationId, cleanContent);


        // Extract possible memories from the user's message
        const extractedMemories = extractMemories(cleanContent);

        // Save extracted memories
        for (const memory of extractedMemories) {
            db.prepare(`
                INSERT INTO memories
                (user_id, content, category, importance)
                VALUES (?, ?, ?, ?)
            `).run(
                userId,
                memory.content,
                memory.category,
                memory.importance
            );
        }


        // Retrieve previous conversation messages
        const previousMessages = db
            .prepare(`
                SELECT role, content
                FROM messages
                WHERE conversation_id = ?
                ORDER BY created_at ASC, id ASC
            `)
            .all(conversationId);


        // Retrieve user's saved memories
        const memories = db
            .prepare(`
                SELECT id, content, category, importance
                FROM memories
                WHERE user_id = ?
                ORDER BY importance DESC, updated_at DESC
                LIMIT 10
            `)
            .all(userId);


        // Generate AI response using conversation + memories
        const startTime = Date.now();

        const aiResponse = await generateAIResponse(
            previousMessages,
            memories
        );

        const latencyMs = Date.now() - startTime;
        db.prepare(`
    INSERT INTO analytics
    (user_id, event_type, latency_ms)
    VALUES (?, ?, ?)
`).run(
            userId,
            "ai_response",
            latencyMs
        );


        // Save AI response
        db.prepare(`
    INSERT INTO messages
    (conversation_id, role, content, latency_ms)
    VALUES (?, 'assistant', ?, ?)
`).run(
            conversationId,
            aiResponse,
            latencyMs
        );

        // Update conversation timestamp
        db.prepare(`
            UPDATE conversations
            SET updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `).run(conversationId);


        res.status(201).json({
            success: true,
            message: "AI response generated successfully",
            data: {
                userMessage: cleanContent,
                assistantMessage: aiResponse,
                memoriesDetected: extractedMemories.length
            }
        });

    } catch (error) {
        console.error("Send message error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to generate AI response"
        });
    }
};


const getMessages = (req, res) => {
    try {
        const userId = req.user.userId;
        const conversationId = req.params.id;

        // Verify conversation ownership
        const conversation = db
            .prepare(`
                SELECT id
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
            messages
        });

    } catch (error) {
        console.error("Get messages error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve messages"
        });
    }
};


module.exports = {
    sendMessage,
    getMessages
};