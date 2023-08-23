import { Router } from "express";
import { getUsers } from "../controllers/user.controller";

export const router = Router();

router.get("/users", getUsers);
