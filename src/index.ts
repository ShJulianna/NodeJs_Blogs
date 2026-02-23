import express, { Request, Response } from "express";
import { setupApp } from "./setup-app";
import { SETTINGS } from "./core/settings/settings";
import { runDB } from "./db/mongo.db";
import * as dotenv from "dotenv";
dotenv.config();

// const bootstrap = async () => {
//   const app = express();
//   setupApp(app);
//   const PORT = SETTINGS.PORT;
//
//   await runDB(SETTINGS.MONGO_URL);
//
//   app.listen(PORT, () => {
//    console.log(`Example app listening on port ${PORT}`);
//   });
//   return app;
// };
//
// bootstrap();

const app = express();

let dbConnected = false;

async function init() {
  if (dbConnected) return;
  await runDB(SETTINGS.MONGO_URL);
  dbConnected = true;
}

setupApp(app);

export default async function handler(req: Request, res: Response) {
  await init();
  return app(req, res);
}
