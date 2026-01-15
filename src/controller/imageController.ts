
import { Request, Response } from "express";
import { prisma } from '../lib/prisma';

export async function listImages(req: Request, res: Response) {
  const page = Number(req.query.page ?? 1);
  const pageSize = Number(req.query.pageSize ?? 10);
  const skip = (page - 1) * pageSize;

  const [items, total] = await Promise.all([
    prisma.imagePost.findMany({
      skip,
      take: pageSize,
      orderBy: { publishedAt: "desc" },
      include: { comments: { orderBy: { createdAt: "asc" } } }
    }),
    prisma.imagePost.count()
  ]);

  // Map to your IImagePost (comments as strings)
  const mapped = items.map(ip => ({
    id: ip.id,
    imageUrl: ip.imageUrl,
    caption: ip.caption,
    comments: ip.comments.map(c => c.text),
    publishedAt: ip.publishedAt.toISOString()
  }));

  res.json({ items: mapped, total, page, pageSize });
}

export async function getImage(req: Request, res: Response) {
  const id = Number(req.params.id);
  const ip = await prisma.imagePost.findUnique({
    where: { id },
    include: { comments: { orderBy: { createdAt: "asc" } } }
  });
  if (!ip) return res.status(404).json({ error: "Image post not found" });

  const mapped = {
    id: ip.id,
    imageUrl: ip.imageUrl,
    caption: ip.caption,
    comments: ip.comments.map(c => c.text),
    publishedAt: ip.publishedAt.toISOString()
  };
  res.json(mapped);
}

export async function createImage(req: Request, res: Response) {
  // Multer puts file info on req.file
  if (!req.file) return res.status(400).json({ error: "Image file is required" });
  const { caption } = req.body;
  const publicPath = `/uploads/images/${req.file.filename}`;

  const created = await prisma.imagePost.create({
    data: { imageUrl: publicPath, caption }
  });

  res.status(201).json({
    id: created.id,
    imageUrl: created.imageUrl,
    caption: created.caption,
    comments: [],
    publishedAt: created.publishedAt.toISOString()
  });
}

export async function deleteImage(req: Request, res: Response) {
  const id = Number(req.params.id);
  await prisma.imagePost.delete({ where: { id } });
  res.status(204).send();
}

export async function addComment(req: Request, res: Response) {
  const id = Number(req.params.id);
  const { text } = req.body;

  // Ensure image post exists
  const post = await prisma.imagePost.findUnique({ where: { id } });
  if (!post) return res.status(404).json({ error: "Image post not found" });

  await prisma.comment.create({
    data: { text, imagePostId: id }
  });

  const updated = await prisma.imagePost.findUnique({
    where: { id },
    include: { comments: { orderBy: { createdAt: "asc" } } }
  });

  res.status(201).json({
    id: updated!.id,
    imageUrl: updated!.imageUrl,
    caption: updated!.caption,
    comments: updated!.comments.map(c => c.text),
    publishedAt: updated!.publishedAt.toISOString()
  });
}
