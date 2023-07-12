import { PrismaClient, Chef, Recipe, ShoppingMemo, User } from "@prisma/client";

const prisma = new PrismaClient();

export { prisma, Chef, Recipe, ShoppingMemo, User };
