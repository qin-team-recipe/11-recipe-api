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

/** 
 * @swagger
 * components:
 *   schemas:
 *     link:
 *       type: object
 *       required:
 *         - id
 *         - site_type
 *         - chef_id
 *         - site_name
 *         - url
 *       properties:
 *         id:
 *           type: string
 *           description: 自動生成されたUUID
 *           example: asdf5488_44dfDU
 *         site_type:
 *           type: string
 *           description: サイトの種類
 *           example: INSTAGRAM
 *         chef_id:
 *           type: string
 *           description: シェフのid
 *           example: asdf5488_44dfDU
 *         site_name:
 *           type: string
 *           description: サイトの名前
 *           example: Instagram
 *         url:
 *           type: string
 *           description: サイトのURL
 *           example: https://www.instagram.com/instagram/
 *         account_name:
 *           type: string
 *           description: アカウント名
 *           example: Carlotta22
 *         created_at:
 *           type: string
 *           description: 作成日時
 *           example: 2020-01-01T00:00:00.000Z
 *         updated_at:
 *           type: string
 *           description: 更新日時
 *           example: 2020-01-01T00:00:00.000Z
 */