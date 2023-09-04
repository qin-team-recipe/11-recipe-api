import { Router } from "express";
import {
  getTopicRecipes,
  getRecipes,
  getRecipe,
  createRecipe,
  getRecipesByChefId,
} from "../controllers/recipe.controller";

export const router = Router();

/**
 * 話題のレシピを取得する
 */
router.get("/recipes/topic", getTopicRecipes);

/**
 * レシピ一覧を取得する
 */
router.get("/recipes", getRecipes);

/**
 * レシピを取得する
 */
router.get("/recipes/:id", getRecipe);

/**
 * レシピを作成する
 */
router.post("/recipes", createRecipe);

/**
 * シェフのレシピ一覧を取得する
 */
router.get("/chefs/:chefId/recipes", getRecipesByChefId);
