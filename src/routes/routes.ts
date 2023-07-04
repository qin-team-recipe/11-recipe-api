import { Router } from "express";

import { router as recipeRouter } from "./recipe.routes";
import { router as chefRouter } from "./chef.routes";

const api = Router().use(recipeRouter).use(chefRouter);

export default Router().use("/api/v1", api);

/**
 * @swagger
 * tags:
 *   - name: chef
 *     description: Chefs endpoint
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     chef:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - role
 *       properties:
 *         id:
 *           type: string
 *           description: 自動生成されたUUID
 *           example: asdf5488_44dfDU
 *         name:
 *           type: string
 *           description: 名前
 *           example: シェフ太郎
 *         role:
 *           type: string
 *           description: CHEF or USER (シェフかユーザーか)
 *           example: CHEF
 *         user_id:
 *           type: string
 *           description: roleがUSERの場合に紐づくuserのid
 *           example:
 *         profile:
 *           type: string
 *           description: シェフのプロフィール
 *           example:
 *         image_url:
 *           type: string
 *           description: シェフのプロフィール画像のURL
 *           example: https://example.com/image.png
 *         created_at:
 *           type: string
 *           description: 作成日時
 *           example: 2020-01-01T00:00:00.000Z
 *         updated_at:
 *           type: string
 *           description: 更新日時
 *           example: 2020-01-01T00:00:00.000Z
 */

/**
 * @swagger
 * tags:
 *  - name: recipe
 *    description: Recipes endpoint
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     recipe:
 *       type: object
 *       required:
 *         - chefId
 *         - servingSize
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           description: 自動生成されたUUID
 *           example: asdf5488_44dfDU
 *         chefId:
 *           type: string
 *           description: レシピを投稿したシェフのid
 *           example: asdf5488_44dfDU
 *         name:
 *           type: string
 *           description: レシピ名
 *           example: カレー
 *         overview:
 *           type: string
 *           description: レシピの概要
 *           example: とても美味しいカレーです
 *         servingSize:
 *           type: number
 *           description: レシピの分量
 *           example: 2
 *         status:
 *           type: RecipeStatus
 *           description: レシピのステータス
 *           example: PUBLISHED
 *         created_at:
 *           type: string
 *           description: 作成日時
 *           example: 2020-01-01T00:00:00.000Z
 *         updated_at:
 *           type: string
 *           description: 更新日時
 *           example: 2020-01-01T00:00:00.000Z
 */
