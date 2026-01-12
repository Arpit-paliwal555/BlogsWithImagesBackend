
import { Router } from "express";
import { validate, blogCreateSchema, blogUpdateSchema } from "../middleware/validate";
import { listBlogs, getBlog, createBlog, updateBlog, deleteBlog, incrementView } from "../controller/blogController";

const router = Router();

router.get("/", listBlogs);
router.get("/:id", getBlog);
router.post("/", validate(blogCreateSchema), createBlog);
router.patch("/:id", validate(blogUpdateSchema), updateBlog);
router.delete("/:id", deleteBlog);

// increment views
router.post("/:id/views", incrementView);

export default router;
