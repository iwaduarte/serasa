import { Router } from "express";
import { register, login, getUser } from "../controllers/userController";
import { auth } from "../middleware/auth";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", auth, getUser);

export default router;
