import express from "express";
import request from "supertest";
import userRoutes from "../../routes/userRoutes.js";
import SequelizeObj from "../../database/connect.js";

const { models } = SequelizeObj;
const { User } = models;

const app = express();
const apiPath = "/users";

app.use(express.json());
app.use(apiPath, userRoutes);

describe("User Routes", () => {
  afterAll(async () => {
    await User.destroy({ where: { username: "testuser" } }); // Deletes all users in the table
  });

  describe("POST /register", () => {
    it("should register a user successfully with valid input", async () => {
      const res = await request(app).post(`${apiPath}/register`).send({
        username: "testuser",
        password: "password123",
        email: "iwaduarte@iwa.com",
      });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("username", "testuser");
    });

    it("should return 400 for missing username or password", async () => {
      const res = await request(app).post(`${apiPath}/register`).send({
        username: "",
        password: "",
        email: "",
      });

      expect(res.statusCode).toEqual(400);
    });
  });

  describe("POST /login", () => {
    it("should login successfully with correct credentials", async () => {
      const res = await request(app).post(`${apiPath}/login`).send({
        username: "testuser",
        password: "password123",
      });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("token");
    });

    it("should return 401 for incorrect credentials", async () => {
      const res = await request(app).post(`${apiPath}/login`).send({
        username: "testuser",
        password: "wrongpassword",
      });

      expect(res.statusCode).toEqual(401);
      expect(res.body.message).toEqual("Invalid credentials");
    });
  });
});
