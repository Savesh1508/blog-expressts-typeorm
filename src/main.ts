import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import "reflect-metadata"
import { db } from "./database/database";

import { loggerMiddleware } from "#/shared/middlewares/logger.middleware";
import { errorMiddleware } from "#/shared/middlewares/error.middleware";
import { notFoundMiddleware } from "#/shared/middlewares/not-found.middleware";
import { authController } from "./modules/auth/auth.controller";
import { blogController } from "./modules/blog/blog.controller";
import { commentController } from "./modules/comments/comments.controller";

dotenv.config();
const app = express();
const PORT = process.env["PORT"] || 3000;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/auth', authController);
app.use('/blogs', blogController);
app.use('/comments', commentController);

app.use(loggerMiddleware);
app.use(errorMiddleware);
app.use(notFoundMiddleware);



async function main() {
  try {
    await db.init();

    app.listen(PORT, () => {
      console.log(`Server successfully started at port - ${PORT}`);
    });
  } catch (error) {
    console.log("Unexpected error:", error);
    process.exit(1);
  }
}

main()