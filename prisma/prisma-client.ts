import {
  PrismaClient,
  Chef,
  Recipe,
  ShoppingMemo,
  ShoppingList,
  ShoppingListIngredient,
  User,
} from "@prisma/client";

const prisma = new PrismaClient();

export {
  prisma,
  Chef,
  Recipe,
  ShoppingMemo,
  ShoppingList,
  ShoppingListIngredient,
  User,
};
