import { Router } from "express";
import { createUser, signinUser, getUsers } from "../controller/userController";
const router = Router();

router.post("/signup", createUser);
router.post("/signin", signinUser);
router.get("/", getUsers);
export default router;