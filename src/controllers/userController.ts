import { Request, Response } from "express";
import { verifyPassword } from "../database/models/userModel.js";
import SequelizeObject from "../database/connect.js";
import jwt from "jsonwebtoken";

const {
  models: { User },
} = SequelizeObject;

const JWT_SECRET = process.env.JWT_SECRET || "secret";

interface AuthRequest extends Request {
  userId?: string;
}

// Register new user
export const register = async (req: Request, res: Response) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email)
    return res.status(400).json("Invalid credentials");

  const [error, response] = await User.create({ username, password, email })
    .then((user) => {
      const { email, username } = user as any;
      return [null, { email, username }];
    })
    .catch((error) => {
      console.log(error);
      return [{ message: "Error registering user" }, null];
    });
  if (error) return res.status(500).json(error);
  return res.json(response);
};

// Login user
export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const user = (await User.findOne({ where: { username } })) as any;
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });
    return res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

export const getUser = async ({ userId }: AuthRequest, res: Response) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching user", error });
  }
};
