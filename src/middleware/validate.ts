
import { z } from "zod";
import { Request, Response, NextFunction } from "express";

export const blogCreateSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1)
});

export const blogUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional()
});

export const imageCreateSchema = z.object({
  caption: z.string().min(1)
});

export const commentCreateSchema = z.object({
  text: z.string().min(1)
});

export function validate<T extends z.ZodTypeAny>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Validation failed", details: result.error.issues });
    }
    // Replace body with parsed data for type safety
    req.body = result.data as any;
    next();
  };
}
