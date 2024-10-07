import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./database/database";
import "reflect-metadata"

import { loggerMiddleware } from "#/shared/middlewares/logger.middleware";
import { errorMiddleware } from "#/shared/middlewares/error.middleware";
import { notFoundMiddleware } from "#/shared/middlewares/not-found.middleware";
import { authController } from "./modules/auth/auth.controller";

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
app.use(loggerMiddleware);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

app.use('/auth', authController);

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