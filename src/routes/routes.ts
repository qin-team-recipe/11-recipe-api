import { Router } from "express";

import recipeController from "../controllers/recipe.controller";
import { router as chefRouter } from "./chef.routes";

const api = Router().use(recipeController).use(chefRouter);

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
