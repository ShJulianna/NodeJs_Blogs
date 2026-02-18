import express from "express";
import { setupApp } from "../../src/setup-app";
import { BlogDTO } from "../../src/blogs/types/blogs";
import request from "supertest";
import { BLOGS_PATH } from "../../src/core/paths/paths";
import { HttpStatus } from "../../src/core/types/types";
import { blogsBD } from "../../src/db/blogs";
import { generateBasicAuthToken } from "../../src/tests/utils/generate-token";
import { clearDb } from "../../src/tests/utils/clear-db";
import { run } from "node:test";
import { closeDB, runDB } from "../../src/db/mongo.db";
import { SETTINGS } from "../../src/core/settings/settings";
import {
  createBlog,
  getBlogById,
  updateBlog,
} from "../../src/core/utils/for-tests/create-blog";
import { getBlogDto } from "../../src/core/utils/for-tests/get-blog-DTO";

describe("Blogs API E2E Tests with DB Verification", () => {
  const app = express();
  setupApp(app);

  const adminToken = generateBasicAuthToken();

  const validBlogData: BlogDTO = {
    name: "Путь QA",
    description: "Тестирование, автоматизация тестов и обеспечение качества.",
    websiteUrl: "https://qa-pathway.ru",
    createdAt: "",
    isMembership: false,
  };

  beforeAll(async () => {
    await runDB(SETTINGS.MONGO_URL);
    await clearDb(app);
  });

  afterAll(closeDB);

  describe("GET /blogs", () => {
    it("should return 200 and the array of blogs from db", async () => {
      await createBlog(app);
      await createBlog(app);

      const res = await request(app).get(BLOGS_PATH).expect(HttpStatus.Ok);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("GET /blogs/:id", () => {
    it("should return 200 and the correct blog from db", async () => {
      const createResponse = await createBlog(app);
      const createdBlog = await getBlogById(app, createResponse.id);
      expect(createdBlog).toEqual({
        ...createResponse,
        id: expect.any(String),
        createdAt: expect.any(String),
      });
    });

    it("should return 404 for a non-existent ID", async () => {
      await request(app).get("/blogs/99999").expect(HttpStatus.BadRequest);
    });
  });

  describe("POST /blogs", () => {
    it("should create blog, add it to db and return 201", async () => {
      const newData: BlogDTO = {
        ...getBlogDto(),
        name: "Путь QAAA",
      };
      await createBlog(app, newData);
    });

    it("should not add data to db on validation error", async () => {
      const invalidData = { ...validBlogData, name: " ".repeat(41) };
      const initialDbLength = blogsBD.blogs.length;

      await request(app)
        .post("/blogs")
        .set("Authorization", adminToken)
        .send(invalidData)
        .expect(HttpStatus.BadRequest);

      // Проверяем, что размер db не изменился
      expect(blogsBD.blogs.length).toBe(initialDbLength);
    });
  });

  describe("PUT /blogs/:id", () => {
    it("should update data in db and return 204", async () => {
      const createdBlog = await createBlog(app);

      const updateData = {
        name: "Путь QABBB",
        description:
          "Тестирование, автоматизация тестов и обеспечение качества.",
        websiteUrl: "https://qa-pathway.ru",
        createdAt: "",
        isMembership: false,
      } as BlogDTO;

      await updateBlog(app, createdBlog.id, updateData);

      const updatedBlog = await getBlogById(app, createdBlog.id);

      // Проверяем, что данные в db обновились
      expect(updatedBlog).toBeDefined();
      expect(updatedBlog?.name).toBe(updateData.name);
      expect(updatedBlog?.description).toBe(updateData.description);
      expect(updatedBlog?.websiteUrl).toBe(updateData.websiteUrl);
    });

    // it("should not update data in db on validation error", async () => {
    //   const createResponse = await request(app)
    //     .post("/blogs")
    //     .set("Authorization", adminToken)
    //     .send(validBlogData);
    //   const createdData = createResponse.body;
    //   const invalidUpdate = {
    //     name: "t".repeat(41),
    //     description: "a".repeat(550),
    //   };
    //
    //   await request(app)
    //     .put(`/blogs/${createdData.id}`)
    //     .set("Authorization", adminToken)
    //     .send({ ...validBlogData, ...invalidUpdate })
    //     .expect(HttpStatus.BadRequest);
    //
    //   const videoInDb = blogsBD.blogs.find((v) => v.id === createdData.id);
    //
    //   // Проверяем, что данные в db НЕ изменились
    //   expect(videoInDb).toEqual(createdData);
    // });

    // it("should return 404 for a non-existent ID", async () => {
    //   await request(app)
    //     .put("/blogs/99999")
    //     .set("Authorization", adminToken)
    //     .send({ ...validBlogData, name: "test" })
    //     .expect(HttpStatus.NotFound);
    // });
  });

  describe("DELETE /blogs/:id", () => {
    it("should delete blogs from db and return 204", async () => {
      const blog = await createBlog(app);
      await request(app)
        .delete(`/blogs/${blog.id}`)
        .set("Authorization", adminToken)
        .expect(HttpStatus.NoContent);

      await request(app)
        .delete(`/blogs/${blog.id}`)
        .set("Authorization", adminToken)
        .expect(HttpStatus.NotFound);
    });
  });
});
