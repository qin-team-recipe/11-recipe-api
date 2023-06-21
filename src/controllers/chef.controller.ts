import { NextFunction, Request, Response, Router } from "express";
import { prisma } from "../../prisma/prisma-client";

const router = Router();

/**
 * Get chefs
 * @route {GET} /chefs
 * @returns chefs
 */
router.get(
  "/chefs",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await prisma.chef.findMany();
      console.log("aaa");
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
