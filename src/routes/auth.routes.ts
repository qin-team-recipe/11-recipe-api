import { Request, Response, NextFunction, Router } from "express";
import passport from "passport";
import { VerifyCallback } from "passport-google-oauth2";
import { prisma } from "../../prisma/prisma-client";

export const router = Router();

const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  req.session.passport ? next() : res.sendStatus(401);
};

passport.serializeUser((user: any, done: VerifyCallback) => {
  done(null, user);
});

passport.deserializeUser((user: any, done: VerifyCallback) => {
  done(null, user);
});

router.get("/is_logged_in", (req: Request, res: Response) => {
  req.session.passport
    ? res.json({ loggedIn: true })
    : res.json({ loggedIn: false });
});

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/api/v1/auth/google/success",
    failureRedirect: "/api/v1/auth/google/failure",
  })
);

router.get(
  "/auth/google/success",
  isLoggedIn,
  async (req: Request, res: Response) => {
    try {
      const googleId = req.session.passport.user.id;
      const user = await prisma.user.findUnique({
        where: { googleId },
      });
      if (!user) {
        return res.status(404).send("User not found");
      }
      // ニックネームがない場合はregisterに飛ばす
      if (!user.name) {
        return res.redirect("/register");
      }
      res.redirect("/");
    } catch (error) {
      console.error(error);
    }
  }
);

router.get("/auth/google/failure", async (req: Request, res: Response) => {
  res.send("failure");
});

router.use("/auth/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/"));
});
