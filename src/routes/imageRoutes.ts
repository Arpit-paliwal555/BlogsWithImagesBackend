
import { Router } from "express";
import { imageUpload } from "../middleware/upload";
import { validate, imageCreateSchema, commentCreateSchema } from "../middleware/validate";
import { listImages, getImage, createImage, deleteImage, addComment } from "../controller/imageController";

const router = Router();

router.get("/", listImages);
router.get("/:id", getImage);

// multipart/form-data: file + caption
router.post("/", imageUpload.single("image"), validate(imageCreateSchema), createImage);

router.delete("/:id", deleteImage);

// comments
router.post("/:id/comments", validate(commentCreateSchema), addComment);

export default router;
