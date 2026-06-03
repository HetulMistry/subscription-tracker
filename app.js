import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";
import { PORT, SERVER_URL } from "./config/env.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import connectDb from "./database/mongodb.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import arcjetMiddleware from "./middlewares/arcjet.middleware.js";
import workflowRouter from "./routes/workflow.routes.js";
import testRouter from "./routes/test.routes.js";

const app = express();

app.set("trust proxy", true);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("public"));
app.use(arcjetMiddleware);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/workflows", workflowRouter);
app.use("/api/v1/test", testRouter);
app.use(
  "/api-docs/v1/",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCssUrl: "/swagger-custom.css",
    customJs: "/swagger-custom.js",
    customSiteTitle: "Subscription Tracker API Docs",
  }),
);

app.use(errorMiddleware);

app.get("/api/v1/health", (req, res) => {
  res.json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date(),
    env: process.env.NODE_ENV || "development",
  });
});

app.listen(PORT, async () => {
  console.log(
    `Server is running on ${SERVER_URL || `http://localhost:${PORT}`}`,
  );

  await connectDb();
});

export default app;
