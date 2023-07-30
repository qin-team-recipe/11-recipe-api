import { PrismaClient, Chef, Recipe, User } from "@prisma/client";

const prisma = new PrismaClient();

export { prisma, Chef, Recipe, User };
