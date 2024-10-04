import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./database/database";

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

async function main() {
  await db.init();
  console.log("Database initialized successfully");

  app.listen(PORT, () => {
    console.log(`Server successfully started at port - ${PORT}`);
  });
}

process.on("SIGINT", async () => {
  await db.close();
  process.exit(0);
});

main().catch((err) => {
  console.log("Unexpected error:", err);
  process.exit(1);
});
