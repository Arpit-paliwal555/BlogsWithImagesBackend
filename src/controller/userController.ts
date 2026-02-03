import { Prisma } from '../../prisma/generated/client';
import {prisma} from '../lib/prisma';
import { Request, Response } from "express";

export async function createUser(req: Request, res: Response){
    try{
      const {username, email, password} = req.body as {
        username ?: string,
        email ?: string,
        password ?: string
      };

      //validation
      if(!username || !email || !password){
        return res.status(400).json({
          message: "usename, email or password missing!"
        });
      }
      //create user
      const created = await prisma.user.create({
        data: {username, email, password},
        include: {
          blogPosts:true,
          imagePosts:true
        }
      });
      return res.status(200).json(created);
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

export async function signinUser(req:Request, res:Response ){
  try{
    const {email, password} = req.body as {
      email ?: string,
      password ?: string
    }
    //validation
    if(!email || !password){
      return res.status(400).json({
        message: "email or password missing!"
      });
    }
    //find user
    const user = await prisma.user.findFirst({
      where: {email, password},
      include: {
        blogPosts:true,
        imagePosts:true 
    }});
    if(user){
      return res.status(200).json(user);
    } else {
      return res.status(404).json({message: "User not found"});
    }
  }catch(err){
    console.error("signinUser error:", err);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
}

export async function getUsers(req:Request, res:Response ){
  try{
    const users = await prisma.user.findMany({
      include:{
        blogPosts:true,
        imagePosts:true
      }
    });
    return res.status(200).json(users);
  } catch(err){
    console.error("getUsers error:", err);
    return res.status(500).json({
      message: "Internal server error"
    });
  } 
}
