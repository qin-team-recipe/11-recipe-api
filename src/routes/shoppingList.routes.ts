import { Router } from "express";
import {
  getShoppingListByUser,
  createShoppingListFromRecipe,
  updateShoppingList,
  deleteShoppingListIngredient,
  deleteCompletedIngredient,
  deleteShoppingList,
  addItemToShoppingList,
  changePositionShoppingListIngredient,
  changePositionShoppingList,
} from "../controllers/shoppingList.controller";

export const router = Router();

router.get("/users/:userId/shopping-list", getShoppingListByUser);
router.post("/users/:userId/shopping-list", createShoppingListFromRecipe);
router.post("/users/:userId/shopping-list/ingredient", addItemToShoppingList);
router.put("/users/:userId/shopping-list/:shoppingListId", updateShoppingList);
router.delete(
  "/users/:userId/shopping-list-ingredients/:shoppingListIngredientId",
  deleteShoppingListIngredient
);
router.delete(
  "/users/:userId/shopping-list/:shoppingListId/completedIngredient",
  deleteCompletedIngredient
);
router.delete(
  "/users/:userId/shopping-list/:shoppingListId",
  deleteShoppingList
);
router.put(
  "/users/:userId/shopping-list-ingredients/:shoppingListIngredientId/move/:position",
  changePositionShoppingListIngredient
);
router.put(
  "/users/:userId/shopping-lists/:shoppingListId/move/:position",
  changePositionShoppingList
);
