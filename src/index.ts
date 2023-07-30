import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import googleStrategy from "passport-google-oauth20";
import cookieParser from "cookie-parser";
import routes from "./routes/routes";
import { prisma } from "../prisma/prisma-client";

const GoogleStrategy = googleStrategy.Strategy;
dotenv.config();

declare module "express-session" {
  interface SessionData {
    passport?: any;
    user?: any;
    // 他のカスタムプロパティを必要に応じて追加する
    // 例: username?: string;
  }
}

const app = express();
const port = 8080;

app.use(express.json());

// 開発用
app.use(cors());
// 本番用
// const corsOptions = {
//   origin: 'http://localhost:3000',
//   // Additional options if needed...
// };

// app.use(cors(corsOptions));

app.use(
  session({
    secret: "mysecret",
    resave: true, //save session on every request
    saveUninitialized: true, //save uninitialized sessions (new and not modified)
    cookie: {
      sameSite: "none", //allow cross-site requests from different origin
      secure: true, //requires HTTPS. For local environment you may skip this.
      maxAge: 1000 * 60 * 60 * 24 * 7, // One Week
    },
  })
);

app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

// passport.serializeUser((user: any, done: any) => {
//   console.log("ユーザーが初めて認証されたときに呼び出されます  ");
//   done(null, user.id);
// });

// passport.deserializeUser(async (id: any, done: any) => {
//   console.log("ユーザーがサイト内を移動するたびに呼び出されます");
//   const user = await prisma.user.findUnique({
//     where: { id },
//   });
//   console.log("aaa: ", user);
//   done(null, user?.id);
// });

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: "http://localhost:8080/api/v1/auth/google/callback",
    },
    (accessToken: string, refreshToken: string, profile: any, done: any) => {
      if (profile) {
        return done(null, profile);
      } else {
        return done(null, false);
      }
    }
  )
);

app.use(routes);

// Swagger options
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Sample API",
      version: "1.0.0",
      description: "A sample API documentation",
    },
    servers: [
      {
        url: "http://localhost:8080", // Your API server URL
      },
    ],
  },
  apis: ["./src/routes/*.ts"], // Path to your API route files
};

// Initialize swagger-jsdoc
const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Serve the Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get("/", (req: Request, res: Response) => {
  res.send(req.session.passport);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
