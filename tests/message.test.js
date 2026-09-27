require("dotenv").config();

const request = require("supertest");
const express = require("express");

const authRoutes = require("../server/routes/authRoutes");
const conversationRoutes = require("../server/routes/conversationRoutes");
const messageRoutes = require("../server/routes/messageRoutes");

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/conversations", messageRoutes);


describe("Message API", () => {

    const username = `messageuser_${Date.now()}`;
    const password = "TestPassword123";

    let token;
    let conversationId;


    test("should register a test user", async () => {

        const response = await request(app)
            .post("/api/auth/register")
            .send({
                username,
                password
            });

        expect(response.statusCode).toBe(201);

        expect(response.body.success).toBe(true);
    });


    test("should login the test user", async () => {

        const response = await request(app)
            .post("/api/auth/login")
            .send({
                username,
                password
            });

        expect(response.statusCode).toBe(200);

        expect(response.body.success).toBe(true);

        expect(response.body.token).toBeDefined();

        token = response.body.token;
    });


    test("should create a conversation", async () => {

        const response = await request(app)
            .post("/api/conversations")
            .set(
                "Authorization",
                `Bearer ${token}`
            )
            .send({
                title: "Message Test Conversation"
            });

        expect(response.statusCode).toBe(201);

        expect(response.body.success).toBe(true);

        expect(response.body.conversation).toBeDefined();

        conversationId = response.body.conversation.id;
    });


    test("should reject an empty message", async () => {

        const response = await request(app)
            .post(`/api/conversations/${conversationId}/messages`)
            .set(
                "Authorization",
                `Bearer ${token}`
            )
            .send({
                content: ""
            });

        expect(response.statusCode).toBe(400);

        expect(response.body.success).toBe(false);
    });


    test("should retrieve messages from the conversation", async () => {

        const response = await request(app)
            .get(`/api/conversations/${conversationId}/messages`)
            .set(
                "Authorization",
                `Bearer ${token}`
            );

        expect(response.statusCode).toBe(200);

        expect(response.body.success).toBe(true);

        expect(Array.isArray(response.body.messages))
            .toBe(true);
    });


    test("should reject message request without token", async () => {

        const response = await request(app)
            .get(`/api/conversations/${conversationId}/messages`);

        expect(response.statusCode).toBe(401);

        expect(response.body.success).toBe(false);
    });

});