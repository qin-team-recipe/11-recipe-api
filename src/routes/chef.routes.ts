import { Router } from "express";
import { body } from "express-validator";
import {
  createChef,
  getChefs,
  getChefById,
  updateChef,
  deleteChef,
  getChefLinks,
  createChefLink,
  getChefLink,
  updateChefLink,
  deleteChefLink,
  getPopularChefs,
} from "../controllers/chef.controller";
import { validationErrorHandler } from "../utils/express-validator";

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
router.post("/chefs", createChefValidator, validationErrorHandler, createChef);

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
router.put("/chefs/:id", updateChefValidator, validationErrorHandler, updateChef);

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

/**
 * @swagger
 * /chefs/{chefId}/links:
 *   get:
 *     summary: Return a chef links
 *     tags:
 *       - chef
 *     description: Get a chef links
 *     operationId: getChefLinks
 *     parameters:
 *       - name: chefId
 *         in: path
 *         description: chef id (uuid)
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *        200:
 *          description: The list of chef links.
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/link'
 *        400:
 *          description: chefId is required.
 *        404:
 *          description: Chef Link not found.
 *        500:
 *          description: Internal server error.
 */
router.get("/chefs/:chefId/links", getChefLinks);

/**
 * @swagger
 * /chefs/{chefId}/links:
 *   post:
 *     summary: Create a new chef link
 *     tags:
 *       - chef
 *     description: Create a new chef link
 *     operationId: createChefLink
 *     parameters:
 *       - name: chefId
 *         in: path
 *         description: chef id (uuid)
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Chef link object that needs to be added to the store
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/link'
 *     responses:
 *       200:
 *         description: Created chef link
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/link'
 *       400:
 *         description: Bad request.
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/ErrorChefIdRequired'
 *                 - $ref: '#/components/schemas/ErrorFieldMissing'
 *             examples:
 *               ErrorChefIdRequired:
 *                 value:
 *                   status: 400
 *                   message: chefId is required.
 *               ErrorFieldMissing:
 *                 value:
 *                   status: 400
 *                   message: Required field is missing.
 *       404:
 *         description: Chef not found.
 *       409:
 *         description: Link with the same siteType already exists.
 *       500:
 *         description: Internal server error.
 */
router.post("/chefs/:chefId/links", createChefLink);

/**
 * @swagger
 * /chefs/{chefId}/links/{id}:
 *   get:
 *     summary: Return a chef link
 *     tags:
 *       - chef
 *     description: Get a chef link
 *     operationId: getChefLink
 *     parameters:
 *       - name: chefId
 *         in: path
 *         description: chef id (uuid)
 *         required: true
 *         schema:
 *           type: string
 *       - name: id
 *         in: path
 *         description: link id (uuid)
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *        200:
 *          description: Chef link object.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/link'
 *        400:
 *          description: chefId and Id is required.
 *        404:
 *          description: Chef Link not found.
 *        500:
 *          description: Internal server error.
 */
router.get("/chefs/:chefId/links/:id", getChefLink);

/**
 * @swagger
 * /chefs/{chefId}/links/{id}:
 *   put:
 *     summary: Update a chef link
 *     tags:
 *       - chef
 *     description: Update a chef link
 *     operationId: updateChefLink
 *     parameters:
 *       - name: chefId
 *         in: path
 *         description: chef id (uuid)
 *         required: true
 *         schema:
 *           type: string
 *       - name: id
 *         in: path
 *         description: link id (uuid)
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/link'
 *     responses:
 *       200:
 *         description: Updated chef link.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/link'
 *       400:
 *         description: Bad request.
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/ErrorIdRequired'
 *                 - $ref: '#/components/schemas/ErrorFieldMissing'
 *             examples:
 *               ErrorIdRequired:
 *                 value:
 *                   status: 400
 *                   message: chefId and Id is required.
 *               ErrorFieldMissing:
 *                 value:
 *                   status: 400
 *                   message: Required field is missing.
 *       404:
 *         description: Chef link not found.
 *       409:
 *         description: Link with the same siteType already exists.
 *       500:
 *         description: Internal server error.
 */
router.put("/chefs/:chefId/links/:id", updateChefLink);

/**
 * @swagger
 * /chefs/{chefId}/links/{id}:
 *   delete:
 *     summary: Delete a chef link
 *     tags:
 *       - chef
 *     description: Delete a chef link
 *     operationId: deleteChefLink
 *     parameters:
 *       - name: chefId
 *         in: path
 *         description: chef id (uuid)
 *         required: true
 *         schema:
 *           type: string
 *       - name: id
 *         in: path
 *         description: link id (uuid)
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *        200:
 *          description: Deleted chef link.
 *        400:
 *          description: chefId and Id is required.
 *        404:
 *          description: Chef Link not found.
 *        500:
 *          description: Internal server error.
 */
router.delete("/chefs/:chefId/links/:id", deleteChefLink);