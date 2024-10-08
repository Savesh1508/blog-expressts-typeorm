import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { User } from "../modules/user/user.entity";
import { Blog } from "../modules/blog/blog.entity";
import { Comment } from "../modules/comments/comments.entity";

dotenv.config();

export class DbClient {
  public connection = new DataSource({
    type: "postgres",
    host: process.env["DB_HOST"],
    port: parseInt(process.env["DB_PORT"] || "5432"),
    username: process.env["DB_USERNAME"],
    password: process.env["DB_PASSWORD"],
    database: process.env["DB_NAME"],
    entities: [User, Blog, Comment],
    synchronize: true,
  });

  public async init() {
    try {
      await this.connection.initialize();
    } catch (error) {
      console.error("Error initializing database:", error);
      throw error;
    }
  }

  public async close() {
    await this.connection.destroy();
    console.log("Database connection closed");
  }

}

export const db = new DbClient();