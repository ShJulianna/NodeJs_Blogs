import express from "express";
import { setupApp } from "./setup-app";
import { SETTINGS } from "./core/settings/settings";
import { runDB } from "./db/mongo.db";

// const bootstrap = async () => {
//   const app = express();
//   setupApp(app);
//   const PORT = SETTINGS.PORT;
//
//   await runDB(SETTINGS.MONGO_URL);
//
//   app.listen(PORT, () => {
//     console.log(`Example app listening on port ${PORT}`);
//   });
//   return app;
// };
//
// bootstrap();
// export default bootstrap();

const app = express();
let isDbConnected = false;

// Настраиваем приложение один раз
setupApp(app);

async function ensureDbConnected() {
  if (!isDbConnected) {
    await runDB(SETTINGS.MONGO_URL);
    isDbConnected = true;
  }
}

// Vercel будет использовать этот handler
export default async function handler(req: Request, res: Response) {
  await ensureDbConnected();
  // Передаём управление в Express
  return app(req, res as any);
}
