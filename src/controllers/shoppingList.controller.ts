import { Handler, Request, NextFunction, Response, Router } from "express";
import {
  prisma,
  ShoppingList,
  ShoppingListIngredient,
} from "../../prisma/prisma-client";

const router = Router();

/**
 * Get shoppingList
 * @route {GET} /users/:userId/shopping-list
 * @param req
 * @param res
 * @returns ShoppingList[]
 * @returns { message: "ShoppingList not found" }
 */
export const getShoppingListByUser: Handler = async (
  req: Request,
  res: Response
) => {
  const { userId } = req.params;
  // TODO ログインユーザーIDとuserIdが一致するかチェック->falseの場合はエラー
  const shoppingList: ShoppingList[] = await prisma.shoppingList.findMany({
    where: { userId },
    include: {
      shoppingListIngredients: true,
    },
  });
  if (!shoppingList) {
    return res.status(404).json({ message: "ShoppingList not found" });
  }
  return res.json(shoppingList);
};

/**
 * Create shoppingList
 * @route {POST} /users/:userId/shopping-list
 * @param req
 * @param res
 * @returns { message: "User not found" }
 * @returns { message: "ShoppingList created" }
 * @returns { message: "Internal Server Error" }
 */
export const createShoppingListFromRecipe: Handler = async (
  req: Request,
  res: Response
) => {
  try {
    const { recipeId, recipeIngredientId, addAllFlg } = req.body;
    const { userId } = req.params;
    // TODO ログインユーザーIDとuserIdが一致するかチェック->falseの場合はエラー
    const shoppingListByUserId = await prisma.shoppingList.findMany({
      where: { userId },
    });
    if (!shoppingListByUserId) {
      return res.status(404).json({ message: "ShoppingList not found" });
    }
    const shoppingListByRecipeId = await prisma.shoppingList.findFirst({
      where: { recipeId },
      include: {
        shoppingListIngredients: true,
      },
    });
    const recipe = await prisma.recipe.findUnique({
      where: {
        id: recipeId,
      },
      select: {
        id: true,
        name: true,
        recipeIngredients: {
          select: {
            text: true,
          },
        },
      },
    });

    // まとめて追加（recipeIdが存在する場合）addAllFlg = true
    if (addAllFlg) {
      // 新規作成
      if (!shoppingListByRecipeId) {
        const newShoppingList = await prisma.shoppingList.create({
          data: {
            userId: userId,
            recipeId: recipeId,
          },
        });
        if (recipe) {
          await prisma.shoppingListIngredient.createMany({
            data: recipe.recipeIngredients.map(
              (recipeIngredient, index: number) => {
                return {
                  shoppingListId: newShoppingList.id,
                  name: recipeIngredient.text,
                  sortOrder: index + 1,
                };
              }
            ),
          });
        }
      }
      // 既存に追加
      else {
        if (recipe) {
          console.log(recipe.recipeIngredients.length);
          await prisma.shoppingListIngredient.createMany({
            data: recipe.recipeIngredients.map(
              (recipeIngredient, index: number) => {
                return {
                  shoppingListId: shoppingListByRecipeId.id,
                  name: recipeIngredient.text,
                  sortOrder:
                    shoppingListByRecipeId.shoppingListIngredients.length +
                    index +
                    1,
                };
              }
            ),
          });
        }
      }
    }
    // 個別追加
    else {
      const recipeIngredient = await prisma.recipeIngredient.findUnique({
        where: {
          id: recipeIngredientId,
        },
      });
      // 新規作成
      if (!shoppingListByRecipeId) {
        const newShoppingList = await prisma.shoppingList.create({
          data: {
            userId: userId,
            recipeId: recipeId,
          },
        });
        if (recipeIngredient) {
          await prisma.shoppingListIngredient.create({
            data: {
              shoppingListId: newShoppingList.id,
              name: recipeIngredient.text,
              sortOrder: 1,
            },
          });
        }
      }
      // 既存に追加
      else {
        if (recipeIngredient) {
          await prisma.shoppingListIngredient.create({
            data: {
              shoppingListId: shoppingListByRecipeId.id,
              name: recipeIngredient.text,
              sortOrder:
                shoppingListByRecipeId.shoppingListIngredients.length + 1,
            },
          });
        }
      }
    }
    return res.json({ message: "ShoppingList added" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Create shoppingList
 * @route {POST} /users/:userId/shopping-list/ingredient
 * @param req
 * @param res
 * @returns { message: "User not found" }
 * @returns { message: "ShoppingList created" }
 * @returns { message: "Internal Server Error" }
 */
export const addItemToShoppingList: Handler = async (
  req: Request,
  res: Response
) => {
  try {
    const { recipeId, recipeIngredientId, name } = req.body;
    const { userId } = req.params;
    // TODO ログインユーザーIDとuserIdが一致するかチェック->falseの場合はエラー
    const shoppingListByUserId = await prisma.shoppingList.findFirst({
      where: { userId, recipeId },
    });
    if (!shoppingListByUserId) {
      return res.status(404).json({ message: "ShoppingList not found" });
    }
    const shoppingListIntegredients =
      await prisma.shoppingListIngredient.findMany({
        where: { shoppingListId: shoppingListByUserId.id },
      });

    await prisma.shoppingListIngredient.create({
      data: {
        shoppingListId: shoppingListByUserId.id,
        name: name,
        sortOrder: shoppingListIntegredients.length + 1,
      },
    });
    return res.json({ message: "ShoppingListIngredient added" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Update shoppingList
 * @route {PUT} /users/:userId/shopping-list/:shoppingListId
 * @param req
 * @param res
 * @returns { message: "ShoppingList not found" }
 * @returns { message: "ShoppingList updated" }
 * @returns { message: "Internal Server Error" }
 */
export const updateShoppingList: Handler = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId, shoppingListId } = req.params;
    const { name, isBought, shoppingListIngredientId } = req.body;
    // TODO ログインユーザーIDとuserIdが一致するかチェック->falseの場合はエラー
    const shoppingListIngredient =
      await prisma.shoppingListIngredient.findFirst({
        where: {
          id: shoppingListIngredientId,
          shoppingListId: shoppingListId,
        },
      });
    if (!shoppingListIngredient) {
      return res.status(404).json({ message: "ShoppingList not found" });
    }
    await prisma.shoppingListIngredient.update({
      where: { id: shoppingListIngredientId },
      data: {
        name: name,
        isBought: isBought,
      },
    });
    return res.json({ message: "ShoppingList updated" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Delete shoppingList
 * @route {DELETE} /users/:userId/shopping-list-ingredients/:shoppingListIngredientId
 * @param req
 * @param res
 * @returns { message: "ShoppingList not found" }
 * @returns { message: "ShoppingList deleted" }
 * @returns { message: "Internal Server Error" }
 */
export const deleteShoppingListIngredient: Handler = async (
  req: Request,
  res: Response
) => {
  try {
    const { shoppingListIngredientId } = req.body;
    const { userId, shoppingListId } = req.params;
    // TODO ログインユーザーIDとuserIdが一致するかチェック->falseの場合はエラー
    const shoppingList = await prisma.shoppingList.findFirst({
      where: {
        id: shoppingListId,
        userId: userId,
      },
      include: {
        shoppingListIngredients: true,
      },
    });
    const shoppingListIngredient =
      await prisma.shoppingListIngredient.findFirst({
        where: { id: shoppingListIngredientId },
      });
    if (!shoppingListIngredient) {
      return res.status(404).json({ message: "ShoppingList not found" });
    }
    const shoppingListIngredientCount =
      shoppingList?.shoppingListIngredients.length;
    await prisma.shoppingListIngredient.delete({
      where: { id: shoppingListIngredientId },
    });
    if (shoppingListIngredientCount === 1) {
      await prisma.shoppingList.delete({
        where: { id: shoppingListId },
      });
      return res.json({ message: "ShoppingList deleted" });
    }
    return res.json({ message: "ShoppingList deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Delete shoppingList
 * @route {DELETE} /users/:userId/shopping-list/:shoppingListId/completedIngredient
 * @param req
 * @param res
 * @returns { message: "ShoppingList not found" }
 * @returns { message: "ShoppingList deleted" }
 * @returns { message: "Internal Server Error" }
 */
export const deleteCompletedIngredient: Handler = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId, shoppingListId } = req.params;
    // TODO ログインユーザーIDとuserIdが一致するかチェック->falseの場合はエラー
    const shoppingList = await prisma.shoppingList.findFirst({
      where: {
        id: shoppingListId,
        userId: userId,
      },
    });

    if (!shoppingList) {
      return res.status(404).json({ message: "ShoppingList not found" });
    }

    const shoppingListIngredients =
      await prisma.shoppingListIngredient.findMany({
        where: {
          shoppingListId: shoppingListId,
          isBought: true,
        },
      });

    if (!shoppingListIngredients) {
      return res.status(404).json({ message: "ShoppingList not found" });
    }

    await prisma.shoppingListIngredient.deleteMany({
      where: {
        shoppingListId: shoppingListId,
        isBought: true,
      },
    });

    return res.json({ message: "ShoppingList deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Delete shoppingList
 * @route {DELETE} /users/:userId/shopping-list/:shoppingListId
 * @param req
 * @param res
 * @returns { message: "ShoppingList not found" }
 * @returns { message: "ShoppingList deleted" }
 * @returns { message: "Internal Server Error" }
 */
export const deleteShoppingList: Handler = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId, shoppingListId } = req.params;
    // TODO ログインユーザーIDとuserIdが一致するかチェック->falseの場合はエラー
    const shoppingList = await prisma.shoppingList.findFirst({
      where: {
        id: shoppingListId,
        userId: userId,
      },
    });

    if (!shoppingList) {
      return res.status(404).json({ message: "ShoppingList not found" });
    }

    const shoppingListIngredients =
      await prisma.shoppingListIngredient.findMany({
        where: {
          shoppingListId: shoppingListId,
        },
      });

    if (!shoppingListIngredients) {
      return res.status(404).json({ message: "ShoppingList not found" });
    }

    await prisma.shoppingListIngredient.deleteMany({
      where: {
        shoppingListId: shoppingListId,
      },
    });

    await prisma.shoppingList.delete({
      where: { id: shoppingListId },
    });

    return res.json({ message: "ShoppingList deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Update shoppingList
 * @route {PUT} /users/:userId/shopping-list-ingredients/:shoppingListIngredientId/move/:position
 * @param req
 * @param res
 * @returns { message: "ShoppingListIngredient not found" }
 * @returns { message: "ShoppingList not found" }
 * @returns { message: "ShoppingList updated" }
 * @returns { message: "Internal Server Error" }
 */
export const changePositionShoppingListIngredient: Handler = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId, shoppingListIngredientId, position } = req.params;
    // TODO ログインユーザーIDとuserIdが一致するかチェック->falseの場合はエラー
    const shoppingListIngredient =
      await prisma.shoppingListIngredient.findFirst({
        where: { id: shoppingListIngredientId },
      });
    if (shoppingListIngredient) {
      const shoppingList = await prisma.shoppingList.findFirst({
        where: {
          id: shoppingListIngredient.shoppingListId,
          userId: userId,
        },
      });
      if (!shoppingList) {
        return res.status(404).json({ message: "ShoppingList not found" });
      }
    } else {
      return res
        .status(404)
        .json({ message: "ShoppingListIngredient not found" });
    }

    // positionがupの場合
    if (position === "up") {
      if (shoppingListIngredient.sortOrder > 1) {
        const currentOrder = shoppingListIngredient.sortOrder;
        const prevOrder = shoppingListIngredient.sortOrder - 1;
        const downShoppingListIngredient =
          await prisma.shoppingListIngredient.findFirst({
            where: { id: shoppingListIngredient.id, sortOrder: prevOrder },
          });
        if (!downShoppingListIngredient) {
          return res
            .status(404)
            .json({ message: "ShoppingListIngredient not found" });
        }
        // positionを入れ替える
        await prisma.shoppingListIngredient.update({
          where: { id: downShoppingListIngredient.id },
          data: {
            sortOrder: currentOrder,
          },
        });
        await prisma.shoppingListIngredient.update({
          where: { id: shoppingListIngredient.id },
          data: {
            sortOrder: prevOrder,
          },
        });
      }
    }
    // positionがdownの場合
    if (position === "down") {
      const currentOrder = shoppingListIngredient.sortOrder;
      const prevOrder = shoppingListIngredient.sortOrder + 1;
      const upShoppingListIngredient =
        await prisma.shoppingListIngredient.findFirst({
          where: { id: shoppingListIngredient.id, sortOrder: prevOrder },
        });
      if (!upShoppingListIngredient) {
        return res
          .status(404)
          .json({ message: "ShoppingListIngredient not found" });
      }
      // positionを入れ替える
      await prisma.shoppingListIngredient.update({
        where: { id: upShoppingListIngredient.id },
        data: {
          sortOrder: currentOrder,
        },
      });
      await prisma.shoppingListIngredient.update({
        where: { id: upShoppingListIngredient.id },
        data: {
          sortOrder: prevOrder,
        },
      });
    }

    return res.json({ message: "ShoppingListIngredient updated" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Update shoppingList
 * @route {PUT} /users/:userId/shopping-lists/:shoppingListId/move/:position
 * @param req
 * @param res
 * @returns { message: "ShoppingList not found" }
 * @returns { message: "ShoppingList updated" }
 * @returns { message: "Internal Server Error" }
 */
export const changePositionShoppingList: Handler = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId, shoppingListId, position } = req.params;
    // TODO ログインユーザーIDとuserIdが一致するかチェック->falseの場合はエラー
    const shoppingList = await prisma.shoppingList.findFirst({
      where: { id: shoppingListId, user: { id: userId } },
    });
    if (!shoppingList) {
      return res.status(404).json({ message: "ShoppingList not found" });
    }
    // positionがupの場合
    if (position === "up") {
      if (shoppingList.sortOrder > 1) {
        const currentOrder = shoppingList.sortOrder;
        const prevOrder = shoppingList.sortOrder - 1;
        const downShoppingList = await prisma.shoppingList.findFirst({
          where: { userId: userId, sortOrder: prevOrder },
        });
        if (!downShoppingList) {
          return res.status(404).json({ message: "ShoppingList not found" });
        }
        // positionを入れ替える
        await prisma.shoppingList.update({
          where: { id: downShoppingList.id },
          data: {
            sortOrder: currentOrder,
          },
        });
        await prisma.shoppingList.update({
          where: { id: shoppingList.id },
          data: {
            sortOrder: prevOrder,
          },
        });
      }
    }
    // positionがdownの場合
    if (position === "down") {
      const currentOrder = shoppingList.sortOrder;
      const prevOrder = shoppingList.sortOrder + 1;
      const upShoppingList = await prisma.shoppingList.findFirst({
        where: { userId: userId, sortOrder: prevOrder },
      });
      if (!upShoppingList) {
        return res.status(404).json({ message: "ShoppingList not found" });
      }
      // positionを入れ替える
      await prisma.shoppingList.update({
        where: { id: upShoppingList.id },
        data: {
          sortOrder: currentOrder,
        },
      });
      await prisma.shoppingList.update({
        where: { id: upShoppingList.id },
        data: {
          sortOrder: prevOrder,
        },
      });
    }
    return res.json({ message: "ShoppingList updated" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default router;
