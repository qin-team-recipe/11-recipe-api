import { Handler, Request, NextFunction, Response, Router } from "express";
import { prisma, ShoppingMemo } from "../../prisma/prisma-client";

const router = Router();

/**
 * Get shoppingMemo
 * @route {GET} /users/:userId/shopping-memo-list
 * @param req
 * @param res
 * @returns ShoppingMemo[]
 * @returns { message: "ShoppingMemo not found" }
 */
export const getShoppingMemoListByUser: Handler = async (
  req: Request,
  res: Response
) => {
  const { userId } = req.params;
  const shoppingMemoList: ShoppingMemo[] = await prisma.shoppingMemo.findMany({
    where: { userId },
  });
  if (!shoppingMemoList) {
    return res.status(404).json({ message: "ShoppingMemo not found" });
  }
  return res.json(shoppingMemoList);
};

/**
 * Create shoppingMemo
 * @route {POST} /users/:userId/shopping-memo-list
 * @param req
 * @param res
 * @returns { message: "User not found" }
 * @returns { message: "ShoppingMemo created" }
 * @returns { message: "Internal Server Error" }
 */
export const createShoppingMemo: Handler = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId } = req.params;
    const { text } = req.body;
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await prisma.shoppingMemo.create({
      data: {
        text: text,
        user: { connect: { id: user.id } },
      },
    });
    return res.json({ message: "ShoppingMemo created" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Update shoppingMemo
 * @route {PUT} /users/:userId/shopping-memo-list/:shoppingMemoId
 * @param req
 * @param res
 * @returns { message: "ShoppingMemo not found" }
 * @returns { message: "ShoppingMemo updated" }
 * @returns { message: "Internal Server Error" }
 */
export const updateShoppingMemo: Handler = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId, shoppingMemoId } = req.params;
    const { text, isBought } = req.body;
    const shoppingMemo = await prisma.shoppingMemo.findFirst({
      where: { id: shoppingMemoId, user: { id: userId } },
    });
    if (!shoppingMemo) {
      return res.status(404).json({ message: "ShoppingMemo not found" });
    }
    await prisma.shoppingMemo.update({
      where: { id: shoppingMemo.id },
      data: {
        text: text ? text : shoppingMemo.text,
        isBought: isBought ? isBought : shoppingMemo.isBought,
      },
    });
    return res.json({ message: "ShoppingMemo updated" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Delete shoppingMemo
 * @route {DELETE} /users/:userId/shopping-memo-list/:shoppingMemoId
 * @param req
 * @param res
 * @returns { message: "ShoppingMemo deleted" }
 * @returns { message: "ShoppingMemo not deleted" }
 * @returns { message: "Internal Server Error" }
 */
export const deleteShoppingMemo: Handler = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId, shoppingMemoId } = req.params;
    const shoppingMemo = await prisma.shoppingMemo.findFirst({
      where: { id: shoppingMemoId, user: { id: userId } },
    });
    if (!shoppingMemo) {
      return res.status(404).json({ message: "ShoppingMemo not found" });
    }
    await prisma.shoppingMemo.delete({
      where: { id: shoppingMemo.id },
    });
    return res.json({ message: "ShoppingMemo deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default router;
