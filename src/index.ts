import express, { Request, Response } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const app = express();

const port = 8080;

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
  apis: ["./src/index.ts"], // Path to your API route files
};

// Initialize swagger-jsdoc
const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Serve the Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

// Sample route
app.get("/api/sample", (req, res) => {
  /**
   * @swagger
   * /api/sample:
   *   get:
   *     summary: Get a sample resource
   *     description: Returns a sample resource
   *     responses:
   *       200:
   *         description: Successful response
   */
  res.json({ message: "Sample resource" });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
