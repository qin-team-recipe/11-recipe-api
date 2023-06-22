import { NextFunction, Request, Response, Router } from "express";
import { prisma, Chef } from "../../prisma/prisma-client";

const router = Router();

/**
 * Get chefs
 * @route {GET} /chefs
 * @param {string} role
 * @returns chefs
 */
router.get(
  "/chefs",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { role } = req.query;

      let chefs: Chef[] = await prisma.chef.findMany({
        include: {
          _count: {
            // _count は、リレーション先のレコード数を取得する
            select: { recipes: true },
          },
        },
        orderBy: {
          name: "asc", // 名前を昇順で並び替える
        },
      });

      if (role) {
        chefs = chefs.filter((chef: Chef) => chef.role === role);
      }

      if (chefs.length === 0) {
        res.status(404).json({ message: "Chefs not found" });
      } else {
        res.json(chefs);
      }
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Post chef
 * @route {POST} /chefs
 * @returns chef
 */
router.post(
  "/chefs",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        name,
        role,
        userId,
        profile,
        imageUrl,
      }: {
        name: string;
        role: "USER" | "CHEF";
        userId: string | null;
        profile: string | null;
        imageUrl: string | null;
      } = req.body;

      if (!name || !role) {
        res.status(400).json({ message: "Name, and role are required" });
        return;
      }

      const chef = await prisma.chef.create({
        data: {
          name: name,
          role: role,
          userId: userId,
          profile: profile,
          imageUrl: imageUrl,
        },
      });
      res.json(chef);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Get chef
 * @route {GET} /chefs/:id
 * @returns chef
 */
router.get(
  "/chefs/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const chef = await prisma.chef.findUnique({
        where: {
          id: String(req.params.id),
        },
        include: {
          recipes: true, // リレーション先のレコードを取得する
          _count: {
            select: {
              recipes: true,
              follows: true,
            },
          },
        },
      });
      if (!chef) {
        res.status(404).json({ message: "Chef not found" });
      } else {
        res.json(chef);
      }
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Put chef
 * @route {PUT} /chefs/:id
 * @returns chef
 */
router.put(
  "/chefs/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        name,
        role,
        userId,
        profile,
        imageUrl,
      }: {
        name: string;
        role: "USER" | "CHEF";
        userId: string | null;
        profile: string | null;
        imageUrl: string | null;
      } = req.body;

      if (!name || !role) {
        res.status(400).json({ message: "Name, and role are required" });
        return;
      }

      const chef = await prisma.chef.update({
        where: {
          id: String(req.params.id),
        },
        data: {
          name: name,
          role: role,
          userId: userId,
          profile: profile,
          imageUrl: imageUrl,
        },
      });

      res.json(chef);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Delete chef
 * @route {DELETE} /chefs/:id
 * @returns chef
 */
router.delete(
  "/chefs/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const chef = await prisma.chef.delete({
        where: {
          id: String(req.params.id),
        },
      });

      res.json({ message: "Deleted chef" });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
