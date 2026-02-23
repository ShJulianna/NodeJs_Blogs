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
  console.log("[init] connecting to DB...");
  await runDB(SETTINGS.MONGO_URL);
  dbConnected = true;
  console.log("[init] DB connected");
}

console.log("[index] before setupApp");
setupApp(app);
console.log("[index] after setupApp");

// тестовый роут на корень
app.get("/", (req: Request, res: Response) => {
  console.log("[GET /] handler called");
  res.send("API is running");
});

export default async function handler(req: Request, res: Response) {
  console.log("[handler] incoming request", req.method, req.url);
  await init();
  return app(req, res);
}
