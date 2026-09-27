const Groq = require("groq-sdk");

const groq = process.env.GROQ_API_KEY
    ? new Groq({ apiKey: process.env.GROQ_API_KEY })
    : null;

const generateAIResponse = async (messages, memories = []) => {
    try {
        if (!groq) {
           throw new Error("GROQ_API_KEY is not available");
        }
        let systemMessage = {
            role: "system",
            content: `
You are a helpful AI conversational assistant.

Use the user's saved memories when they are relevant to the current conversation.

Saved user memories:
${memories.length > 0
    ? memories.map(memory => `- ${memory.content}`).join("\n")
    : "- No saved memories yet."
}

Do not mention the memory system unless the user asks about it.
Do not invent information that is not present in the conversation or saved memories.
`
        };

        const messagesWithMemory = [
            systemMessage,
            ...messages
        ];

        const completion = await groq.chat.completions.create({
            model: "openai/gpt-oss-120b",
            messages: messagesWithMemory,
            temperature: 0.7,
            max_tokens: 500
        });

        return completion.choices[0].message.content;

    } catch (error) {
        console.error("Groq API error:", error.message);
        throw new Error("Failed to generate AI response");
    }
};


module.exports = {
    generateAIResponse
};