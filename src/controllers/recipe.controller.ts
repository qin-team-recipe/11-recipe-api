import { Handler, Request, Response, Router } from "express";

import { prisma, Chef, Recipe } from "../../prisma/prisma-client";

const router = Router();

type CreateRecipeBody = {
  chefId: Chef["id"];
  name?: Recipe["name"];
  overview?: Recipe["overview"];
  servingSize: Recipe["servingSize"];
  status: Recipe["status"];
};

/**
 * Get recipes
 * @route {GET} /recipes/topic
 * @returns recipes
 */
export const getTopicRecipes: Handler = async (req: Request, res: Response) => {
  try {
    const beforeThreeDays = new Date(
      new Date().getTime() - 3 * 24 * 60 * 60 * 1000
    );
    const recipes = await prisma.recipe.findMany({
      include: {
        likes: true,
        recipeImages: true,
        _count: {
          select: {
            likes: {
              where: {
                createdAt: {
                  gte: beforeThreeDays,
                },
              },
            },
          },
        },
      },
      where: {
        likes: {
          some: {
            createdAt: {
              gte: beforeThreeDays,
            },
          },
        },
      },
      orderBy: {
        likes: {
          _count: "desc",
        },
      },
      take: 10,
    });

    let topicRecipes = recipes.map((recipe) => ({
      name: recipe.name,
      imageUrl: recipe.recipeImages[0],
      beforeThreeDaysLikes: recipe._count.likes,
      AllLikes: recipe.likes.length,
    }));

    return res.json(topicRecipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Get recipes
 * @route {GET} /recipes
 * @returns recipes
 */
export const getRecipes: Handler = async (req: Request, res: Response) => {
  try {
    const recipes = await prisma.recipe.findMany({
      include: {
        likes: true,
      },
    });
    return res.json(recipes);
  } catch (error) {
    console.error(error);
    return res.status(404).json({ message: "Recipes not found" });
  }
};

/**
 * Get recipe
 * @route {GET} /recipes/:id
 * @returns recipe
 */
export const getRecipe: Handler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Recipe id not found" });
    }
    const recipe = await prisma.recipe.findUnique({
      where: { id },
      include: {
        likes: true,
        recipeImages: true,
        recipeSteps: true,
        recipeIngredients: true,
        recipeLinks: true,
      },
    });
    if (recipe) {
      return res.json(recipe);
    }
    return res.status(404).json({ message: "Recipe not found" });
  } catch (error) {
    console.error(error);
    return res.status(404).json({ message: "Recipe not found" });
  }
};

/**
 * Create recipe
 * @route {POST} /recipes
 * @returns { message: "Recipe created" }
 */
export const createRecipe: Handler = async (req: Request, res: Response) => {
  try {
    const { chefId, name, overview, servingSize, status }: CreateRecipeBody =
      req.body;
    const chef = await prisma.chef.findUnique({
      where: { id: chefId },
    });
    if (!chef) {
      return res.status(404).json({ message: "Chef not found" });
    }
    await prisma.recipe.create({
      data: {
        chefId,
        name,
        overview,
        servingSize,
        status,
      },
    });
    return res.json({ message: "Recipe created" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Recipe not created" });
  }
};

/**
 * Get recipes by chef id
 * @route {GET} /chefs/{chefId}/recipes
 * @returns recipes
 */
export const getRecipesByChefId: Handler = async (
  req: Request,
  res: Response
) => {
  try {
    const sort = req.query.sort;
    if (sort === "popular") {
      const recipes = await prisma.chef
        .findUnique({
          where: { id: req.params.chefId },
        })
        .recipes({
          include: {
            recipeImages: true,
            _count: {
              select: { likes: true },
            },
          },
          orderBy: {
            likes: {
              _count: "desc",
            },
          },
        });
      return res.json(recipes);
    }
    const recipes = await prisma.chef
      .findUnique({
        where: { id: req.params.chefId },
      })
      .recipes({
        include: {
          recipeImages: true,
          _count: {
            select: { likes: true },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    return res.json(recipes);
  } catch (error) {
    console.error(error);
    return res.status(404).json({ message: "Recipes not found" });
  }
};

/**
 * フォローしているシェフ一覧を取得する
 * Get recipes by user id
 * @route {GET} /users/{userId}/following-chefs
 * @returns recipes
 */
export const getFollowingChefs: Handler = async (
  req: Request,
  res: Response
) => {
  try {
    // レシピの新着順にシェフを取得する
    const followedChefs = await prisma.follow.findMany({
      where: { userId: req.params.userId },
      select: {
        chefId: true,
      },
    });
    const followedChefsIds = followedChefs.map((followedChef) => {
      return followedChef.chefId;
    });
    const chefsWithRecipes = await prisma.chef.findMany({
      where: {
        id: {
          in: followedChefsIds,
        },
      },
      include: {
        recipes: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    return res.json(chefsWithRecipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * フォローしているシェフのレシピ一覧を取得する
 * Get recipes by user id
 * @route {GET} /users/{userId}/following-chefs/recipes
 * @returns recipes
 */
export const getFollowingChefsRecipes: Handler = async (
  req: Request,
  res: Response
) => {
  try {
    const follows = await prisma.follow.findMany({
      where: { userId: req.params.userId },
    });
    const recipes = await prisma.recipe.findMany({
      where: {
        chefId: {
          in: follows.map((follow) => follow.chefId),
        },
      },
      include: {
        recipeImages: true,
        _count: {
          select: { likes: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return res.json(recipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * お気に入りのレシピ
 * Get like recipes by user id
 * @route {GET} /users/{userId}/like-recipes
 */
export const getLikeRecipes: Handler = async (req: Request, res: Response) => {
  try {
    const recipes = await prisma.recipe.findMany({
      where: {
        likes: {
          some: {
            userId: req.params.userId,
          },
        },
      },
      include: {
        recipeImages: true,
        _count: {
          select: { likes: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return res.json(recipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
