import express, { Express } from "express";
import { BLOGS_PATH, POSTS_PATH, TESTING_PATH } from "./core/paths/paths";
import { testRouter } from "./testing/routers/testing.router";
import { blogsRouter } from "./blogs/routers/blogs.router";
import { postsRouter } from "./posts/routers/posts.router";

export const setupApp = (app: Express) => {
  app.use(express.json()); //middleware express.json() парсит JSON в теле запроса и добавляет его как объект в свойство body запроса (req.body.).

  app.get("/", (_req, res) => {
    res.status(200).send("Hello world!!");
  });

  app.use(BLOGS_PATH, blogsRouter);
  app.use(TESTING_PATH, testRouter);
  app.use(POSTS_PATH, postsRouter);

  // setupSwagger(app);
  return app;
};
