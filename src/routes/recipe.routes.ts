import { Router } from "express";
import {
  getTopicRecipes,
  getRecipes,
  getRecipe,
  createRecipe,
} from "../controllers/recipe.controller";

export const router = Router();

router.get("/recipes/topic", getTopicRecipes);

/**
 * @swagger
 * /recipes:
 *   get:
 *     summary: Return a recipe list
 *     tags:
 *       - recipe
 *     description: Get a list of recipes
 *     operationId: getRecipes
 *     responses:
 *       200:
 *         description: The list of recipes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/recipe'
 *       404:
 *         description: Recipes not found
 */

router.get("/recipes", getRecipes);

/**
 * @swagger
 * /recipes/{id}:
 *   get:
 *     summary: Return a recipe
 *     tags:
 *       - recipe
 *     description: Get a recipe
 *     operationId: getRecipe
 *     parameters:
 *       - name: id
 *         in: path
 *         description: recipe id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Recipe object that needs to be added to the store
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/recipe'
 *     responses:
 *       200:
 *         description: The recipe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/recipe'
 *       404:
 *         description: Recipe id not found or Recipe not found
 */

router.get("/recipes/:id", getRecipe);

/**
 * @swagger
 * /recipes:
 *   post:
 *     summary: Create a new recipe
 *     tags:
 *       - recipe
 *     description: Create a new recipe
 *     operationId: createRecipe
 *     requestBody:
 *       description: Recipe object that needs to be added to the store
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/recipe'
 *     responses:
 *       200:
 *         description: Created recipe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/recipe'
 *       400:
 *         description: Chef not found
 *       500:
 *         description: Recipe not created
 */
router.post("/recipes", createRecipe);
