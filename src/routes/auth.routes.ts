import { Request, Response, NextFunction, Router } from "express";
import passport from "passport";
import { VerifyCallback } from "passport-google-oauth2";
import { body } from "express-validator";
import { prisma } from "../../prisma/prisma-client";

export const router = Router();

const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  console.log("req.session: ", req.session);
  console.log(" req.session.user: ", req.session.user);
  console.log("req.user: ", req.user); // ユーザーオブジェクトを確認
  next();
};

const registerValidator = body("name")
  .notEmpty()
  .withMessage("name is required");

passport.serializeUser((user: any, done: VerifyCallback) => {
  done(null, user);
});

passport.deserializeUser(async (user: any, done: VerifyCallback) => {
  try {
    // ユーザーオブジェクトをデシリアライズした後、データベースなどからユーザー情報を取得
    const fetchedUser = await prisma.user.findUnique({
      where: { id: user.id }, // ユーザーのIDで取得する例です。適宜変更してください。
    });
    console.log("fetchedUser: ", fetchedUser);
    done(null, fetchedUser);
  } catch (error) {
    console.error(error);
    done(error);
  }
});

router.get("/is_logged_in", (req: Request, res: Response) => {
  req.session.passport
    ? res.json({ loggedIn: true })
    : res.json({ loggedIn: false });
});

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    // session: false,
    failureRedirect: "/api/v1/auth/google/failure",
  }),
  async (req: Request, res: Response) => {
    try {
      const test = req.session;
      console.log("test: ", test);
      const googleId = req.user?.id;
      console.log("LOOK", googleId);
      if (!googleId) return res.status(404).send("User not found");
      const user = await prisma.user.upsert({
        where: {
          googleId,
        },
        update: {},
        create: {
          googleId: googleId,
          email: "test@gmail.com",
        },
      });
      console.log("req.session: ", req.session);
      console.log("req.user: ", req.user);
      console.log("req.isAuthenticated(): ", req.isAuthenticated());

      console.log("googleId: ", googleId);

      console.log("user: ", user);
      if (!user) {
        return res.status(404).send("User not found");
      }
      // セッションにユーザー情報を保存
      req.session.user = user;
      // ニックネームがない場合はregisterに飛ばす
      if (!user.name) {
        // return res.redirect("http://localhost:3000/register/");
        return res.send("aaa");
      }
      // return res.redirect("http://localhost:3000/");
      return res.send("bbb");
    } catch (error) {
      console.error(error);
    }
  }
);

router.get("/auth/google/failure", async (req: Request, res: Response) => {
  res.send("failure");
});

router.post(
  "/register",
  isLoggedIn,
  registerValidator,
  async (req: Request, res: Response) => {
    const {
      name,
    }: {
      name: string;
    } = req.body;

    try {
      const googleId = req.user?.id;
      // const googleId = req.session.passport.user.id;
      console.log("googleId: ", googleId);
      await prisma.user.update({
        where: { googleId },
        data: { name },
      });
      res.status(200).send("OK");
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }
);

router.get("/auth/logout", (req: Request, res: Response) => {
  req.session.destroy(() => res.redirect("/"));
});
