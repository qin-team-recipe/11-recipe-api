import { Handler, Request, NextFunction, Response, Router } from "express";
import { prisma, ShoppingMemo } from "../../prisma/prisma-client";

const router = Router();

/**
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
  // TODO ログインユーザーIDとuserIdが一致するかチェック
  const shoppingMemoList: ShoppingMemo[] = await prisma.shoppingMemo.findMany({
    where: { userId },
    orderBy: { sortOrder: "asc" },
  });
  if (!shoppingMemoList) {
    return res.status(404).json({ message: "ShoppingMemo not found" });
  }
  return res.json(shoppingMemoList);
};

/**
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
    // TODO ログインユーザーIDとuserIdが一致するかチェック
    const { text } = req.body;
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const shoppingMemoList = await prisma.shoppingMemo.findMany({
      where: { user: { id: user.id } },
    });
    await prisma.shoppingMemo.create({
      data: {
        text: text,
        user: { connect: { id: user.id } },
        sortOrder: shoppingMemoList.length + 1,
      },
    });
    return res.json({ message: "ShoppingMemo created" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
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
    // TODO ログインユーザーIDとuserIdが一致するかチェック
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
    // TODO ログインユーザーIDとuserIdが一致するかチェック
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

/**
 * @route {DELETE} /users/:userId/shopping-memo-list/completed
 * @param req
 * @param res
 * @returns { message: "ShoppingMemo deleted" }
 * @returns { message: "ShoppingMemoList not deleted" }
 * @returns { message: "Internal Server Error" }
 */
export const deleteShoppingMemoListByCompleted: Handler = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId } = req.params;
    // TODO ログインユーザーIDとuserIdが一致するかチェック
    const shoppingMemo = await prisma.shoppingMemo.findMany({
      where: { isBought: true, user: { id: userId } },
    });
    if (shoppingMemo.length === 0) {
      return res.status(404).json({ message: "ShoppingMemoList not found" });
    }
    await prisma.shoppingMemo.deleteMany({
      where: { isBought: true, user: { id: userId } },
    });
    return res.json({ message: "ShoppingMemoList deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * @route {DELETE} /users/:userId/shopping-memo-list
 * @param req
 * @param res
 * @returns { message: "ShoppingMemo deleted" }
 * @returns { message: "ShoppingMemoList not deleted" }
 * @returns { message: "Internal Server Error" }
 */
export const deleteShoppingMemoList: Handler = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId } = req.params;
    // TODO ログインユーザーIDとuserIdが一致するかチェック
    const shoppingMemo = await prisma.shoppingMemo.findMany({
      where: { user: { id: userId } },
    });
    if (shoppingMemo.length === 0) {
      return res.status(404).json({ message: "ShoppingMemoList not found" });
    }
    await prisma.shoppingMemo.deleteMany({
      where: { user: { id: userId } },
    });
    return res.json({ message: "ShoppingMemoList deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * @route {PUT} /users/:userId/shopping-memo-list/:shoppingMemoId/move/:position/
 * @param req
 * @param res
 * @returns { message: "ShoppingMemo deleted" }
 * @returns { message: "ShoppingMemoList not deleted" }
 * @returns { message: "Internal Server Error" }
 */
export const changePositionShoppingMemo: Handler = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId, shoppingMemoId, position } = req.params;
    // TODO ログインユーザーIDとuserIdが一致するかチェック
    const shoppingMemo = await prisma.shoppingMemo.findFirst({
      where: { id: shoppingMemoId, user: { id: userId } },
    });
    if (!shoppingMemo) {
      return res.status(404).json({ message: "ShoppingMemo not found" });
    }
    // positionがupの場合
    if (position === "up") {
      if (shoppingMemo.sortOrder > 1) {
        const currentOrder = shoppingMemo.sortOrder;
        const prevOrder = shoppingMemo.sortOrder - 1;
        const downShoppingMemo = await prisma.shoppingMemo.findFirst({
          where: { userId: userId, sortOrder: prevOrder },
        });
        if (!downShoppingMemo) {
          return res.status(404).json({ message: "ShoppingMemo not found" });
        }
        // positionを入れ替える
        await prisma.shoppingMemo.update({
          where: { id: downShoppingMemo.id },
          data: {
            sortOrder: currentOrder,
          },
        });
        await prisma.shoppingMemo.update({
          where: { id: shoppingMemo.id },
          data: {
            sortOrder: prevOrder,
          },
        });
      }
    }
    // positionがdownの場合
    if (position === "down") {
      const currentOrder = shoppingMemo.sortOrder;
      const prevOrder = shoppingMemo.sortOrder + 1;
      const upShoppingMemo = await prisma.shoppingMemo.findFirst({
        where: { userId: userId, sortOrder: prevOrder },
      });
      if (!upShoppingMemo) {
        return res.status(404).json({ message: "ShoppingMemo not found" });
      }
      // positionを入れ替える
      await prisma.shoppingMemo.update({
        where: { id: upShoppingMemo.id },
        data: {
          sortOrder: currentOrder,
        },
      });
      await prisma.shoppingMemo.update({
        where: { id: shoppingMemo.id },
        data: {
          sortOrder: prevOrder,
        },
      });
    }
    return res.json({ message: "ShoppingMemo position changed" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default router;
