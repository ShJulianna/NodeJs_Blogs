import { Router } from "express";
import { HttpStatus } from "../../core/types/types";
import { blogsBD } from "../../db/blogs";
import { postsDB } from "../../db/posts";
import { blogsCollection, postsCollection, runDB } from "../../db/mongo.db";

export const testRouter = Router();

testRouter.delete("/all-data", async (req, res) => {
  try {
    await Promise.all([
      blogsCollection.deleteMany({}),
      postsCollection.deleteMany({}),
      // сюда же добавь deleteMany для других коллекций (users, comments и т.п.)
    ]);

    res.sendStatus(HttpStatus.NoContent);
  } catch (e) {
    console.error("[DELETE /testing/all-data] error:", e);
    res.sendStatus(HttpStatus.InternalServerError);
  }
});
