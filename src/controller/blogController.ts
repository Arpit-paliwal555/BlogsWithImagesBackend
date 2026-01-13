
import { PrismaClient } from "../../prisma/generated";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export async function listBlogs(req: Request, res: Response) {
  const page = Number(req.query.page ?? 1);
  const pageSize = Number(req.query.pageSize ?? 10);
  const skip = (page - 1) * pageSize;

  const [items, total] = await Promise.all([
    prisma.blogPost.findMany({
      skip,
      take: pageSize,
      orderBy: { publishedAt: "desc" }
    }),
    prisma.blogPost.count()
  ]);

  res.json({ items, total, page, pageSize });
}

export async function getBlog(req: Request, res: Response) {
  const id = Number(req.params.id);
  const blog = await prisma.blogPost.findUnique({ where: { id } });
  if (!blog) return res.status(404).json({ error: "Blog not found" });
  res.json(blog);
}

export async function createBlog(req: Request, res: Response) {
  const { title, description } = req.body;
  const created = await prisma.blogPost.create({
    data: { title, description }
  });
  res.status(201).json(created);
}

export async function updateBlog(req: Request, res: Response) {
  const id = Number(req.params.id);
  const { title, description } = req.body;
  const updated = await prisma.blogPost.update({
    where: { id },
    data: { title, description }
  });
  res.json(updated);
}

export async function deleteBlog(req: Request, res: Response) {
  const id = Number(req.params.id);
  await prisma.blogPost.delete({ where: { id } });
  res.status(204).send();
}

export async function incrementView(req: Request, res: Response) {
  const id = Number(req.params.id);
  const updated = await prisma.blogPost.update({
    where: { id },
    data: { viewCount: { increment: 1 } }
  });
  res.json(updated);
}
