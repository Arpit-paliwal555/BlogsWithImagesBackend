
import { Router } from "express";
import blogRoutes from "./blogRoutes";
import imageRoutes from "./imageRoutes";

const router = Router();

router.get("/health", (_req, res) => res.json({ ok: true }));

router.use("/blogs", blogRoutes);
router.use("/images", imageRoutes);

export default router;
