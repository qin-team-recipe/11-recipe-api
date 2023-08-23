import express, { Request, Response } from "express";
import session from "express-session";
import passport from "passport";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import routes from "./routes/routes";

declare module "express-session" {
  interface SessionData {
    passport?: any;
    // 他のカスタムプロパティを必要に応じて追加する
    // 例: username?: string;
  }
}

const app = express();
const port = 8080;

app.use(express.json());

app.use(
  session({
    secret: "mysecret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

import "./auth";

app.use(passport.initialize());
app.use(passport.session());

app.use(routes);

// Swagger options
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Recipe APP API",
      version: "1.0.0",
      description: "Recipe App API documentation",
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
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
