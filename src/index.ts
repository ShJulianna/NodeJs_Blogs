import express from "express";
import { setupApp } from "./setup-app";
import { SETTINGS } from "./core/settings/settings";
import { runDB } from "./db/mongo.db";
import * as dotenv from "dotenv";
dotenv.config();

const bootstrap = async () => {
  const app = express();
  setupApp(app);
  const PORT = SETTINGS.PORT;

  await runDB(SETTINGS.MONGO_URL);

  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
  });
  return app;
};

bootstrap();

// const app = express();
//
// async function init() {
//   await runDB(SETTINGS.MONGO_URL);
// }
//
// setupApp(app);
//
// export default async function handler(req: Request, res: Response) {
//   try {
//     await init();
//   } catch (e) {
//     console.error("[handler] DB init error:", e);
//     res.status(500).send({ error: "Database connection error" });
//     return;
//   }
//
//   console.log("[handler] request:", req.method, req.url);
//   return app(req, res);
// }
