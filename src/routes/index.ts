
import { Router } from "express";
import blogRoutes from "./blogRoutes";
import imageRoutes from "./imageRoutes";
import userRoutes from "./userRoutes";

const router = Router();

router.get("/health", (_req, res) => res.json({ ok: true }));

router.use("/blogs", blogRoutes);
router.use("/images", imageRoutes);
router.use("/users", userRoutes);

export default router;
