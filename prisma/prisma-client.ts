import { PrismaClient, Chef } from "@prisma/client";

const prisma = new PrismaClient();

export { prisma, Chef };
