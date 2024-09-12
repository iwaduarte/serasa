import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import sequelize from "./database/connection";
import userRoutes from "./routes/userRoutes";
import "../dotenv.ts";
import { requestLogger } from "./middleware/logger";

const { PORT: envPORT } = process.env;
const PORT = envPORT || 3000;

const app = express();

// Adds security headers
app.use(helmet());
app.use(express.json());

// Rate limiter to prevent brute force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);
app.use(requestLogger);
app.use("/api/users", userRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
