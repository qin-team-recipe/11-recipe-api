import { Handler, NextFunction, Request, Response, Router } from "express";
import { prisma, User } from "../../prisma/prisma-client";

const router = Router();

/**
 * Get users
 * @route {GET} /users
 * @param req
 * @param res
 * @returns User[]
 * @returns { message: "User not found" }
 */
export const getUsers: Handler = async (req: Request, res: Response) => {
  const users: User[] = await prisma.user.findMany();
  if (!users) {
    return res.status(404).json({ message: "User not found" });
  }
  return res.json(users);
};

export default router;
