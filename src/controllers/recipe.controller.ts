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

export default router;
