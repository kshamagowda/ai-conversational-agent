const db = require("../database/database");

const saveMemory = (userId, content, category = "general", importance = 0.5) => {
    const result = db
        .prepare(`
            INSERT INTO memories
            (user_id, content, category, importance)
            VALUES (?, ?, ?, ?)
        `)
        .run(userId, content, category, importance);

    return db
        .prepare(`
            SELECT id, user_id, content, category, importance, created_at, updated_at
            FROM memories
            WHERE id = ?
        `)
        .get(result.lastInsertRowid);
};


const getMemories = (userId, limit = 10) => {
    return db
        .prepare(`
            SELECT id, content, category, importance, created_at, updated_at
            FROM memories
            WHERE user_id = ?
            ORDER BY importance DESC, updated_at DESC
            LIMIT ?
        `)
        .all(userId, limit);
};


const deleteMemory = (userId, memoryId) => {
    const result = db
        .prepare(`
            DELETE FROM memories
            WHERE id = ? AND user_id = ?
        `)
        .run(memoryId, userId);

    return result.changes > 0;
};


module.exports = {
    saveMemory,
    getMemories,
    deleteMemory
};