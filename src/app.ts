import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "reflect-metadata"

import { loggerMiddleware } from "#/shared/middlewares/logger.middleware";
import { errorMiddleware } from "#/shared/middlewares/error.middleware";
import { notFoundMiddleware } from "#/shared/middlewares/not-found.middleware";
import { authController } from "./modules/auth/auth.controller";
import { blogController } from "./modules/blog/blog.controller";
import { commentController } from "./modules/comments/comments.controller";
import { userController } from './modules/user/user.controller';

export function createApp() {
  const app = express();

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
  app.use('/users', userController)
  app.use('/blogs', blogController);
  app.use('/comments', commentController);

  app.use(loggerMiddleware);
  app.use(errorMiddleware);
  app.use(notFoundMiddleware);

  return app;
}