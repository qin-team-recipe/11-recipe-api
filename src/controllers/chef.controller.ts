import { Handler, NextFunction, Request, Response, Router } from "express";
import { validationResult } from "express-validator";
import { prisma, Chef } from "../../prisma/prisma-client";

const router = Router();

/**
 * Get popular chefs
 * @route GET /chefs/popular
 * @param req
 * @param res
 * @returns chefs
 */
export const getPopularChefs: Handler = async (req: Request, res: Response) => {
  try {
    const beforeThreeDays = new Date(
      new Date().getTime() - 3 * 24 * 60 * 60 * 1000
    );
    let chefs = await prisma.chef.findMany({
      include: {
        follows: true,
        _count: {
          select: {
            follows: {
              where: {
                createdAt: {
                  gte: beforeThreeDays,
                },
              },
            },
          },
        },
      },
      where: {
        role: "CHEF",
        follows: {
          some: {
            createdAt: {
              gte: beforeThreeDays,
            },
          },
        },
      },
      orderBy: {
        follows: {
          _count: "desc",
        },
      },
      take: 10,
    });

    let popularChefs = chefs.map((chef) => ({
      name: chef.name,
      imageUrl: chef.imageUrl,
      beforeThreeDaysFollowers: chef._count.follows,
      AllFollowers: chef.follows.length,
    }));

    res.json(popularChefs);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Get chefs
 * @route {GET} /chefs
 * @param req
 * @param res
 * @param next
 * @returns chefs
 */
export const getChefs: Handler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
      return res.status(404).json({ message: "Chefs not found" });
    } else {
      return res.json(chefs);
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Post chef
 * @route {POST} /chefs
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const createChef: Handler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      name,
      userId,
      profile,
      imageUrl,
    }: {
      name: string;
      userId: string;
      profile: string | null;
      imageUrl: string | null;
    } = req.body;

    const chef = await prisma.chef.create({
      data: {
        name: name,
        role: "USER",
        userId: userId,
        profile: profile,
        imageUrl: imageUrl,
      },
    });
    res.json(chef);
  } catch (error) {
    next(error);
  }
};

/**
 * Get chef
 * @route {GET} /chefs/:id
 * @param req
 * @param res
 * @param next
 * @returns chef
 */
export const getChefById: Handler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.params.id) {
      res.status(400).json({ message: "Id is required" });
      return;
    }

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
};

/**
 * Update chef
 * @route {PUT} /chefs/:id
 * @param req
 * @param res
 * @param next
 * @returns chef
 */
export const updateChef: Handler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      name,
      profile,
      imageUrl,
    }: {
      name: string;
      profile: string | null;
      imageUrl: string | null;
    } = req.body;

    if (!name) {
      res.status(400).json({ message: "Name is required" });
      return;
    }

    const chef = await prisma.chef.update({
      where: {
        id: String(req.params.id),
      },
      data: {
        name: name,
        profile: profile,
        imageUrl: imageUrl,
      },
    });

    res.json(chef);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete chef
 * @route {DELETE} /chefs/:id
 * @param req
 * @param res
 * @param next
 * @returns chef
 */
export const deleteChef: Handler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.params.id) {
      res.status(400).json({ message: "Id is required" });
      return;
    }
    const chef = await prisma.chef.delete({
      where: {
        id: String(req.params.id),
      },
    });

    if (!chef) {
      res.status(404).json({ message: "Chef not found" });
    }

    res.json({ message: "Deleted chef" });
  } catch (error) {
    next(error);
  }
};

export default router;
