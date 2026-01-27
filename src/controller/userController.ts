import { Prisma } from '../../prisma/generated/client';
import {prisma} from '../lib/prisma';
import { Request, Response } from "express";

export async function createUser(req: Request, res: Response){
    
try {
    const { username, email, password } = req.body as {
      username?: string;
      email?: string;
      password?: string;
    };

    // Basic validation
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "username, email, and password are required",
      });
    }

    // Create user
    const created = await prisma.user.create({
      data: { username, email, password },
      include: {
        blogPosts: true,
        imagePosts: true,
      },
    });

    // Optional: shape it strictly to your IUser (if you prefer)
    // const user: IUser = {
    //   id: created.id,
    //   username: created.username,
    //   email: created.email,
    //   blogPosts: created.blogPosts,
    //   imagePosts: created.imagePosts,
    // };

    return res.status(201).json(created);
  } catch (err) {
    // Handle unique constraint errors (P2002)
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      const target = (err.meta?.target as string[])?.join(", ") || "field(s)";
      return res.status(409).json({
        message: `A user with the same ${target} already exists.`,
      });
    }

    console.error("createUser error:", err);
    return res.status(500).json({ message: "Internal server error" });

}
}