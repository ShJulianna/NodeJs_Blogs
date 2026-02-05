import express from "express";
import { setupApp } from "../../src/setup-app";
import { BlogDTO } from "../../src/blogs/types/blogs";
import request from "supertest";
import { BLOGS_PATH } from "../../src/core/paths/paths";
import { HttpStatus } from "../../src/core/types/types";
import { blogsBD } from "../../src/db/blogs";
import { generateBasicAuthToken } from "../../src/tests/utils/generate-token";
import { clearDb } from "../../src/tests/utils/clear-db";

describe("Blogs API E2E Tests with DB Verification", () => {
  const app = express();
  setupApp(app);

  const adminToken = generateBasicAuthToken();

  const validBlogData: BlogDTO = {
    name: "Путь QA",
    description: "Тестирование, автоматизация тестов и обеспечение качества.",
    websiteUrl: "https://qa-pathway.ru",
  };

  beforeAll(async () => {
    await clearDb(app);
  });

  describe("GET /blogs", () => {
    it("should return 200 and the array of blogs from db", async () => {
      await request(app)
        .post(BLOGS_PATH)
        .set("Authorization", adminToken)
        .send({ ...validBlogData, name: "Another blog" })
        .expect(HttpStatus.Created);

      await request(app)
        .post(BLOGS_PATH)
        .set("Authorization", adminToken)
        .send({ ...validBlogData, name: "Another video2" })
        .expect(HttpStatus.Created);

      const res = await request(app).get(BLOGS_PATH).expect(HttpStatus.Ok);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("GET /blogs/:id", () => {
    it("should return 200 and the correct blog from db", async () => {
      const createResponse = await request(app)
        .post(BLOGS_PATH)
        .set("Authorization", adminToken)
        .send(validBlogData)
        .expect(HttpStatus.Created);
      const createdId = createResponse.body.id;

      const res = await request(app)
        .get(`${BLOGS_PATH}/${createdId}`)
        .expect(HttpStatus.Ok);

      const inDb = blogsBD.blogs.find((v) => v.id === createdId);

      expect(res.body).toEqual(inDb);
    });

    it("should return 404 for a non-existent ID", async () => {
      await request(app).get("/blogs/99999").expect(HttpStatus.NotFound);
    });
  });

  describe("POST /blogs", () => {
    it("should create blog, add it to db and return 201", async () => {
      const newData: BlogDTO = {
        name: "Путь QA",
        description:
          "Тестирование, автоматизация тестов и обеспечение качества.",
        websiteUrl: "https://qa-pathway.ru",
      };
      const res = await request(app)
        .post("/blogs")
        .set("Authorization", adminToken)
        .send(newData)
        .expect(HttpStatus.Created);

      expect(res?.body.name).toBe(newData.name);
      expect(res?.body.description).toBe(newData.description);
      expect(res?.body.websiteUrl).toBe(newData.websiteUrl);
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
      const createResponse = await request(app)
        .post("/blogs")
        .set("Authorization", adminToken)
        .send(validBlogData);
      const createdId = createResponse.body.id;

      const updateData = {
        name: "Путь QA",
        description:
          "Тестирование, автоматизация тестов и обеспечение качества.",
        websiteUrl: "https://qa-pathway.ru",
      };

      await request(app)
        .put(`/blogs/${createdId}`)
        .set("Authorization", adminToken)
        .send(updateData)
        .expect(HttpStatus.NoContent);

      const updatedVideoInDb = blogsBD.blogs.find((v) => v.id === createdId);

      // Проверяем, что данные в db обновились
      expect(updatedVideoInDb).toBeDefined();
      expect(updatedVideoInDb?.name).toBe(updateData.name);
      expect(updatedVideoInDb?.description).toBe(updateData.description);
      expect(updatedVideoInDb?.websiteUrl).toBe(updateData.websiteUrl);
    });

    it("should not update data in db on validation error", async () => {
      const createResponse = await request(app)
        .post("/blogs")
        .set("Authorization", adminToken)
        .send(validBlogData);
      const createdData = createResponse.body;
      const invalidUpdate = {
        name: "t".repeat(41),
        description: "a".repeat(550),
      };

      await request(app)
        .put(`/blogs/${createdData.id}`)
        .set("Authorization", adminToken)
        .send({ ...validBlogData, ...invalidUpdate })
        .expect(HttpStatus.BadRequest);

      const videoInDb = blogsBD.blogs.find((v) => v.id === createdData.id);

      // Проверяем, что данные в db НЕ изменились
      expect(videoInDb).toEqual(createdData);
    });

    it("should return 404 for a non-existent ID", async () => {
      await request(app)
        .put("/blogs/99999")
        .set("Authorization", adminToken)
        .send({ ...validBlogData, name: "test" })
        .expect(HttpStatus.NotFound);
    });
  });

  describe("DELETE /blogs/:id", () => {
    it("should delete blogs from db and return 204", async () => {
      const createResponse = await request(app)
        .post("/blogs")
        .set("Authorization", adminToken)
        .send(validBlogData);
      const createdId = createResponse.body.id;

      const initialDbLength = blogsBD.blogs.length;

      await request(app)
        .delete(`/blogs/${createdId}`)
        .set("Authorization", adminToken)
        .expect(HttpStatus.NoContent);

      // Проверяем, что в db стало на один элемент меньше
      expect(blogsBD.blogs.length).toBe(initialDbLength - 1);

      const deletedVideoInDb = blogsBD.blogs.find((v) => v.id === createdId);
      // Проверяем, что видео действительно удалено из db
      expect(deletedVideoInDb).toBeUndefined();
    });

    it("should return 404 and not change db for a non-existent ID", async () => {
      const initialDbLength = blogsBD.blogs.length;
      await request(app)
        .delete("/blogs/99999")
        .set("Authorization", adminToken)
        .expect(HttpStatus.NotFound);
      expect(blogsBD.blogs.length).toBe(initialDbLength);
    });
  });
});
