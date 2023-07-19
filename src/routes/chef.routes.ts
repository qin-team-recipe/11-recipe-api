import { Router } from "express";
import { body } from "express-validator";
import {
  createChef,
  getChefs,
  getChefById,
  updateChef,
  deleteChef,
  getPopularChefs,
} from "../controllers/chef.controller";

export const router = Router();

const createChefValidator = [
  body("name").notEmpty().withMessage("name is required"),
  body("userId").notEmpty().withMessage("userId is required"),
];
const updateChefValidator = [
  body("name").notEmpty().withMessage("name is required"),
];

router.get("/chefs/popular", getPopularChefs);

/**
 * @swagger
 * /chefs:
 *   get:
 *     summary: Return a chef list
 *     tags:
 *       - chef
 *     description: Get a list of chefs
 *     operationId: getChefs
 *     parameters:
 *       - name: role
 *         in: query
 *         description: role
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: the list of chefs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/chef'
 *       404:
 *         description: Chefs not found
 */
router.get("/chefs", getChefs);

/**
 * @swagger
 * /chefs:
 *   post:
 *     summary: Create a new chef
 *     tags:
 *       - chef
 *     description: Create a new chef
 *     operationId: createChef
 *     requestBody:
 *       description: Chef object that needs to be added to the store
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/chef'
 *     responses:
 *       200:
 *         description: Created chef
 *         content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/chef'
 *       400:
 *         description: Name, and role are required
 *       500:
 *         description: Internal server error
 */
router.post("/chefs", createChefValidator, createChef);

/**
 * @swagger
 * /chefs/{id}:
 *   get:
 *     summary: Return a chef
 *     tags:
 *       - chef
 *     description: Get a chef
 *     operationId: getChefById
 *     parameters:
 *       - name: id
 *         in: path
 *         description: chef id(uuid)
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: the list of chefs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/chef'
 *       400:
 *         description: Id is required
 *       404:
 *         description: Chefs not found
 */
router.get("/chefs/:id", getChefById);

/**
 * @swagger
 * /chefs/{id}:
 *   put:
 *     summary: Update a chef
 *     tags:
 *       - chef
 *     description: Update a chef
 *     operationId: updateChef
 *     parameters:
 *       - name: id
 *         in: path
 *         description: chef id(uuid)
 *         required: true
 *         schema: string
 *     requestBody:
 *       description: Chef object that needs to be added to the store
 *       required: true
 *       content:
 *         application/json:
 *         schema:
 *           $ref: '#/components/schemas/chef'
 *     responses:
 *       200:
 *         description: Updated chef
 *         content:
 *           application/json:
 *           schema:
 *             $ref: '#/components/schemas/chef'
 *       400:
 *         description: Name, is required
 *       404:
 *         description: Chefs not found
 *       500:
 *         description: Internal server error
 */
router.put("/chefs/:id", updateChefValidator, updateChef);

/**
 * @swagger
 * /chefs/{id}:
 *   delete:
 *     summary: Delete a chef
 *     tags:
 *       - chef
 *     description: Delete a chef
 *     operationId: deleteChef
 *     parameters:
 *       - name: id
 *         in: path
 *         description: chef id(uuid)
 *         required: true
 *         schema: string
 *     responses:
 *       200:
 *         description: Deleted chef
 *       400:
 *         description: Id is required
 *       404:
 *         description: Chefs not found
 *       500:
 *         description: Internal server error
 */
router.delete("/chefs/:id", deleteChef);
