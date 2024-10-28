import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../modules/user/user.entity";
import { Blog } from "../modules/blog/blog.entity";
import { Comment } from "../modules/comments/comments.entity";
import { envConfig } from "../shared/config/env.config";

export class DbClient {
  public connection = new DataSource({
    type: "postgres",
    host: envConfig.DB_HOST,
    port: envConfig.DB_PORT,
    username: envConfig.DB_USERNAME,
    password: envConfig.DB_PASSWORD,
    database: envConfig.DB_NAME,
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