import express from "express";
import request from "supertest";

import userRoutes from "../../routes/userRoutes";

const app = express();
app.use(express.json());
app.use("/api/users", userRoutes);

describe("User Routes", () => {
  describe("POST /register", () => {
    it("should register a user successfully with valid input", async () => {
      const res = await request(app).post("/api/users/register").send({
        username: "testuser",
        password: "password123",
      });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("username", "testuser");
    });

    it("should return 400 for missing username or password", async () => {
      const res = await request(app).post("/api/users/register").send({
        username: "",
        password: "",
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body.errors).toBeDefined();
    });
  });

  describe("POST /login", () => {
    it("should login successfully with correct credentials", async () => {
      const res = await request(app).post("/api/users/login").send({
        username: "testuser",
        password: "password123",
      });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("token");
    });

    it("should return 401 for incorrect credentials", async () => {
      const res = await request(app).post("/api/users/login").send({
        username: "testuser",
        password: "wrongpassword",
      });

      expect(res.statusCode).toEqual(401);
      expect(res.body.message).toEqual("Invalid credentials");
    });
  });
});
