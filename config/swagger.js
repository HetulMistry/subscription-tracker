import { PORT } from "./env.js";
import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Subscription Tracker API",
      version: "1.0.0",
      description: "API for managing subscriptions and triggering workflows",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: "Local server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "JWT Bearer token authentication",
        },
      },
    },
  },
  apis: ["./routes/*.js"],
};

export const swaggerSpec = swaggerJSDoc(options);
