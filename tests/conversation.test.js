require("dotenv").config();

const request = require("supertest");
const express = require("express");

const authRoutes = require("../server/routes/authRoutes");
const conversationRoutes = require("../server/routes/conversationRoutes");

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/conversations", conversationRoutes);

describe("Conversation API", () => {

    const username = `conversationuser_${Date.now()}`;
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


    test("should create a new conversation", async () => {

        const response = await request(app)
            .post("/api/conversations")
            .set(
                "Authorization",
                `Bearer ${token}`
            )
            .send({
                title: "Test Conversation"
            });

        expect(response.statusCode).toBe(201);

        expect(response.body.success).toBe(true);

        expect(response.body.conversation).toBeDefined();

        conversationId = response.body.conversation.id;
    });


    test("should retrieve user's conversations", async () => {

        const response = await request(app)
            .get("/api/conversations")
            .set(
                "Authorization",
                `Bearer ${token}`
            );

        expect(response.statusCode).toBe(200);

        expect(response.body.success).toBe(true);

        expect(Array.isArray(response.body.conversations))
            .toBe(true);
    });


    test("should reject conversations request without token", async () => {

        const response = await request(app)
            .get("/api/conversations");

        expect(response.statusCode).toBe(401);

        expect(response.body.success).toBe(false);
    });

});