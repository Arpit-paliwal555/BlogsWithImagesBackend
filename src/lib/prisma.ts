import { PrismaClient } from "../../prisma/generated/client";
import {PrismaPg} from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL || "";

const pgPool = new pg.Pool({ connectionString });
const prismaAdaptor = new PrismaPg(pgPool);

export const prisma = new PrismaClient({
  adapter: prismaAdaptor
});