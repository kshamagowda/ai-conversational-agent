require("dotenv").config();
const request = require("supertest");
const express = require("express");

const authRoutes = require("../server/routes/authRoutes");
const protectedRoutes = require("../server/routes/protectedRoutes");

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);

describe("Authentication API", () => {

    const username = `testuser_${Date.now()}`;
    const password = "TestPassword123";

    let token;

    test("should register a new user", async () => {

        const response = await request(app)
            .post("/api/auth/register")
            .send({
                username,
                password
            });

        expect(response.statusCode).toBe(201);

        expect(response.body.success).toBe(true);

        expect(response.body.user.username)
            .toBe(username);
    });


    test("should login the registered user", async () => {

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


    test("should access protected profile with valid token", async () => {

        const response = await request(app)
            .get("/api/protected/profile")
            .set(
                "Authorization",
                `Bearer ${token}`
            );

        expect(response.statusCode).toBe(200);

        expect(response.body.success).toBe(true);

        expect(response.body.user.username)
            .toBe(username);
    });


    test("should reject protected route without token", async () => {

        const response = await request(app)
            .get("/api/protected/profile");

        expect(response.statusCode).toBe(401);

        expect(response.body.success).toBe(false);
    });

});