import { Handler, NextFunction, Request, Response, Router } from "express";
import { validationResult } from "express-validator";
import { prisma, Chef, Link } from "../../prisma/prisma-client";

const router = Router();

type ChefLinkBody = {
  siteType: Link["siteType"];
  chefId: Chef["id"];
  siteName: Link["siteName"];
  url: Link["url"];
  accountName?: Link["accountName"];
};

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

/**
 * Get chef links
 * @route {GET} /chefs/:chefId/links
 * @param req
 * @param res
 * @returns chef links
 */
export const getChefLinks: Handler = async (req: Request, res: Response) => {
  try {
    const links = await prisma.link.findMany({
      where: {
        chefId: String(req.params.chefId),
      },
    });
    if (links.length === 0) {
      res.status(404).json({ message: "Chef Links not found" });
    } else {
      res.json(links);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export default router;

/**
 * Create chef link
 * @route {POST} /chefs/:chefId/links
 * @param req
 * @param res
 * @returns { message: "Link created" }
 */

export const createChefLink: Handler = async (req: Request, res: Response) => {
  try {
    const { chefId } = req.params;
    if (!chefId) {
      res.status(400).json({ message: "ChefId is required" });
      return;
    }
    const chef = await prisma.chef.findUnique({
      where: {
        id: String(chefId),
      },
    });
    if (!chef) {
      res.status(404).json({ message: "Chef not found" });
      return;
    }
    const { siteType, siteName, url, accountName } : ChefLinkBody = req.body;
    if (!siteType || !siteName || !url ) {
      res.status(400).json({ message: "Required field is missing" });
      return;
    }
    const existingLink = await prisma.link.findFirst({
      where: {
        siteType: siteType,
        chefId: String(chefId),
      },
    })
    if (existingLink) {
      res.status(409).json({ message: "Chef Link with the same siteType already exists" });
      return;
    }
    await prisma.link.create({
      data: {
        siteType: siteType,
        siteName: siteName,
        url: url,
        accountName: accountName,
        chefId: chefId,
      },
    });
    res.json({ message: "Chef Link created" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
}

/**
 * Get chef link
 * @route {GET} /chefs/:chefId/links/:id
 * @param req
 * @param res
 * @returns chef link
 */

export const getChefLink : Handler = async (req: Request, res: Response) => {
  try {
    const { id, chefId } = req.params;
    if (!id || !chefId) {
      res.status(400).json({ message: "ChefId and Id is required" });
      return;
    }
    const link = await prisma.link.findFirst({
      where: {
        id: String(id),
        chefId: String(chefId),
      }
    });
    if (!link) {
      res.status(404).json({ message: "Chef Link not found" });
      return;
    }
    res.json(link);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
}

/**
 * Update chef link
 * @route {PUT} /chefs/:chefId/links/:id
 * @param req
 * @param res
 * @returns chef link
*/

export const updateChefLink : Handler = async (req: Request, res: Response) => {
  try {
    const { id, chefId } = req.params;
    if (!id || !chefId) {
      res.status(400).json({ message: "ChefId and Id is required" });
      return;
    }
    const link = await prisma.link.findFirst({
      where: {
        id: String(id),
        chefId: String(chefId),
      }
    });
    if (!link) {
      res.status(404).json({ message: "Chef Link not found" });
      return;
    }
    const { siteType = link.siteType, siteName = link.siteName, url = link.url, accountName } : ChefLinkBody = req.body;
    if (!siteType || !siteName || !url ) {
      res.status(400).json({ message: "Required field is missing" });
      return;
    }
    const existingLink = await prisma.link.findFirst({
      where: {
        chefId: link.chefId, // 同じ chefId を持つ他の Link を検索
        siteType: siteType, // 更新しようとしている siteType と一致するものを検索
      },
    });
     // 更新しようとしているリンクのsiteType以外に同じstyeTypeのLinkが存在している場合はエラー
    if (existingLink && link.siteType !== siteType) {
      res.status(409).json({ message: "Chef Link with the same siteType already exists" });
      return;
    }
    await prisma.link.update({
      where: {
        id: String(id),
      },
      data: {
        siteType: siteType,
        siteName: siteName,
        url: url,
        accountName: accountName,
      }
    })
    res.json({ message: "Chef Link updated" });
  } catch(error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
}

/**
 * Delete chef link
 * @route {DELETE} /chefs/:chefId/links/:id
 * @param req
 * @param res
 * @returns { message: "Chef Link deleted" }
*/

export const deleteChefLink : Handler = async (req: Request, res: Response) => {
  try {
    const { id, chefId } = req.params;
    if (!id || !chefId) {
      res.status(400).json({ message: "ChefId and Id is required" });
      return;
    }
    const link = await prisma.link.findFirst({
      where: {
        id: String(id),
        chefId: String(chefId),
      }
    });
    if (!link) {
      res.status(404).json({ message: "Chef Link not found" });
      return;
    }
    await prisma.link.delete({
      where: {
        id: String(id),
      }
    })
    res.json({ message: "Chef Link deleted" });
  } catch(error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
}