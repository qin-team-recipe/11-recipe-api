import { Router } from "express";
import {
  createShoppingMemo,
  deleteShoppingMemo,
  updateShoppingMemo,
  getShoppingMemoListByUser,
  deleteShoppingMemoListByCompleted,
  deleteShoppingMemoList,
  changePositionShoppingMemo,
} from "../controllers/shoppingMemo.controller";

export const router = Router();

router.get("/users/:userId/shopping-memo-list", getShoppingMemoListByUser);
router.post("/users/:userId/shopping-memo-list", createShoppingMemo);
router.put(
  "/users/:userId/shopping-memo-list/:shoppingMemoId",
  updateShoppingMemo
);

router.delete("/users/:userId/shopping-memo-list", deleteShoppingMemoList);

router.delete(
  "/users/:userId/shopping-memo-list/completed",
  deleteShoppingMemoListByCompleted
);

router.delete(
  "/users/:userId/shopping-memo-list/:shoppingMemoId",
  deleteShoppingMemo
);

router.put(
  "/users/:userId/shopping-memo-list/:shoppingMemoId/move/:position/",
  changePositionShoppingMemo
);
