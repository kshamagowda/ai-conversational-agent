const extractMemories = (message) => {
    const memories = [];

    const text = message.trim();

    // User's name
    const nameMatch = text.match(
        /(?:my name is)\s+([A-Za-z]+(?:\s+[A-Za-z]+)?)/i
    );

    if (nameMatch) {
        memories.push({
            content: `User's name is ${nameMatch[1].trim()}.`,
            category: "personal",
            importance: 0.9
        });
    }

    // Learning / studying
    const learningMatch = text.match(
        /(?:i am learning|i'm learning|i am studying|i'm studying)\s+(.+)/i
    );

    if (learningMatch) {
        memories.push({
            content: `User is learning ${learningMatch[1].trim()}.`,
            category: "learning",
            importance: 0.8
        });
    }

    // Preferences
    const preferenceMatch = text.match(
        /(?:i prefer|i like)\s+(.+)/i
    );

    if (preferenceMatch) {
        memories.push({
            content: `User prefers ${preferenceMatch[1].trim()}.`,
            category: "preference",
            importance: 0.7
        });
    }

    // Favorite programming language
    const favoriteLanguageMatch = text.match(
        /my favorite programming language is\s+([A-Za-z0-9+#. -]+)/i
    );

    if (favoriteLanguageMatch) {
        memories.push({
            content: `User's favorite programming language is ${favoriteLanguageMatch[1].trim()}.`,
            category: "preference",
            importance: 0.9
        });
    }

    return memories;
};

module.exports = {
    extractMemories
};