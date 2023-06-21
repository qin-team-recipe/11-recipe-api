import { NextFunction, Request, Response, Router } from "express";

const router = Router();

/**
 * Post recipe
 * @route {POST} /recipe
 * @returns
 */
router.post(
  "/recipes",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json({ message: "Created recipe" });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
