import { PrismaClient, Chef, Link, Recipe } from "@prisma/client";

const prisma = new PrismaClient();

export { prisma, Chef, Link, Recipe };
