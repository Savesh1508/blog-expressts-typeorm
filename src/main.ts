import "reflect-metadata"
import { db } from "./database/database";
import { envConfig } from "./shared/config"
import { createApp } from "./app";

const app = createApp()

async function main() {
  try {
    await db.init();

    app.listen(envConfig.PORT, () => {
      console.log(`Server successfully started at port - ${envConfig.PORT}`);
    });
  } catch (error) {
    console.log("Unexpected error:", error);
    process.exit(1);
  }
}

main()